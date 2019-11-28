
Vue.use(VueMaterial.default)

const { required } = window.validators;
var validationMixin = window.vuelidate.validationMixin;

Vue.component('user-info',{
    props:['user'],
    model:{
        prop:'user',
        event:'user-change'
    },
    methods:{
        isMessageExisted(){
            if(this.user.messageCount<=0){
                return 'without-message';
            }
            else{
                return 'with-message';
            }
        }
    },
    components:{
        'without-message':{
            props:['user'],
            template:`
                <md-button md-menu-trigger class="md-icon-button md-raised md-dense md-primary">
                    <md-avatar class="md-avatar-icon">{{user.userName[0]}}</md-avatar>
                </md-button>
            `
        },
        'with-message':{
            props:['user'],
            template:`
                <md-badge md-position="bottom" :md-content="user.messageCount">
                    <md-button md-menu-trigger class="md-icon-button md-raised md-dense md-primary">
                        <md-avatar class="md-avatar-icon">{{user.userName[0]}}</md-avatar>
                    </md-button>
                </md-badge>
            `
        }
    },
    template:`
    <div>
        <md-menu md-direction="bottom-end" md-size="huge" md-align-trigger>
        <component :is="isMessageExisted()" :user="user"></component>
        <md-menu-content>
            <md-toolbar class="md-layout md-alignment-center-center md-large md-transparent" md-elevation="0">
            <md-content>
                <md-avatar class="md-layout-item md-avatar-icon md-primary md-large md-gutter">{{user.userName[0]}}</md-avatar>
            </md-content>
            </md-toolbar>
            <md-menu-item lass="md-layout md-alignment-center-center">
                <span class="md-layout-item md-headline" style="text-align: center;">{{user.userName}}</span>
            </md-menu-item>
            <md-menu-item lass="md-layout md-alignment-center-center">
                <span class="md-layout-item md-caption" style="text-align: center;">{{user.sysRole}}</span>
            </md-menu-item>
            <md-menu-item lass="md-layout md-alignment-center-space-between">
                <md-button class="md-button md-raised md-layout-item" href="">Profile</md-button>
                <md-button class="md-button md-raised md-accent md-layout-item" href="">Sign Out</md-button>
            </md-menu-item>
        </md-menu-content>
        </md-menu>
    </div>
    `
});
Vue.component('signin-button', {
    props:['value'],
    data: () => ({
        showSigninDialog: false,
        showSignupDialog: false,
        user:this.value
    }),
    watch: {
        user:function(newVal, oldVal){
            this.$emit('input',newVal);
        }
    },
    template: `
            <div>
                <md-menu md-direction="bottom-end" md-align-trigger>
                    <md-button md-menu-trigger class="md-icon-button md-raised md-dense md-primary">
                        <md-icon>person</md-icon>
                    </md-button>
                    <md-menu-content>
                      <md-menu-item @click="showSigninDialog=true">Sign in</md-menu-item>
                      <md-menu-item @click="showSignupDialog=true">Sign up</md-menu-item>
                    </md-menu-content>
                </md-menu>
                <sign-in-dialog v-on:unshowDialog="showSigninDialog=false" :showDialog="showSigninDialog" v-model="user"></sign-in-dialog>
            </div>
    `,
    components:{
        'sign-in-dialog':{
            mixins: [validationMixin],
            props:['showDialog','value'],
            data: () => ({
                incorrectPassword: false,
                banned:false,
                form: {
                    userName: null,
                    passWord: null
                },
                user: {
                    messageCount: null,
                    isLoged: false,
                    userName: null,
                    userId: null,
                    sysRole: null
                },
                sending: false,
            }),
            validations: {
                form: {
                    userName: {
                        required
                    },
                    passWord: {
                        required
                    }
                }
            },
            methods: {
                getValidationClass(validation) {
                    return {
                        'md-invalid': validation.$invalid && validation.$dirty || this.incorrectPassword
                    }
                },
                clearForm() {
                    this.$v.$reset();
                    this.form.userName = null;
                    this.form.passWord = null;
                },
                Login() {
                    this.sending = true
        
                    // Instead of this timeout, here you can call your API
                    window.setTimeout(() => {
                        var f = new fetchApi();
                        var userInfo = {};
                        userInfo['userName'] = this.form.userName;
                        userInfo['passWord'] = sha256.hmac(this.form.userName, this.form.passWord);
                        var response = f.Put('Users/Login', userInfo);
                        this.sending = false;
                        response.then(r => {
                            if (!r.ok) {
                                if(r.status!=403){
                                    this.incorrectPassword = true;
                                }
                                else{
                                    this.emit('unshowDialog')
                                    this.banned=true;
                                }
                            }
                            else {
                                this.incorrectPassword = false;
                                r.json().then(responseBody => {
                                    this.user.isLoged = true;
                                    this.user.userName = responseBody['userName'];
                                    this.user.userId = responseBody['userId'];
                                    this.user.sysRole = responseBody['sysRole'];
                                    this.user.messageCount = 5;
                                    this.$emit('unshowDialog')
                                })
                                this.$emit('input', this.user);
                            }
                        });
                    }, 1500);
        
                },
                validateUser() {
                    this.$v.$touch()
        
                    if (!this.$v.$invalid) {
                        this.Login()
                    }
                }
            },
            template:`
                <div>
                    <md-dialog @md-closed="$emit('unshowDialog')" :md-active.sync="showDialog" style="width: 60vw;">
                        <md-dialog-title>Sign-in</md-dialog-title>
                        <div class="md-layout md-gutter" style="padding: 1rem;">
                            <div class="md-layout-item md-size-100">
                            <md-field :class="getValidationClass($v.form.userName)">
                                <md-icon>person</md-icon>
                                <label for="user-name">User Name</label>
                                <span class="md-error md-gutter" v-if="!$v.form.userName.required">The User name is required</span>
                                <span class="md-error md-gutter" v-else-if="incorrectPassword">User name or Password is Incorrect.</span>
                                <md-input name="user-name" id="user-name" v-model="$v.form.userName.$model" :disabled="sending" />
                            </md-field>
                            </div>                          
                            <div class="md-layout-item md-size-100">
                                <md-field :class="getValidationClass($v.form.passWord)">
                                    <md-icon>vpn_key</md-icon>
                                    <label for="pass-word">Password</label>
                                    <span class="md-error" v-if="!$v.form.passWord.required">The Password is required</span>
                                    <span class="md-error" v-else-if="incorrectPassword">User name or Password is Incorrect.</span>
                                    <md-input name="pass-word" id="pass-word" type="Password" v-model="$v.form.passWord.$model" :disabled="sending" />
                                </md-field>
                            </div>
                        </div>
                        <!--<pre>{{this.user}}</pre>-->
                        <md-dialog-actions>
                        <md-button class="md-primary" @click="validateUser" :disabled="sending">Confirm</md-button>
                        <md-button class="md-accent" @click="$emit('unshowDialog');clearForm()">Cancel</md-button>
                        </md-dialog-actions>
                        <md-progress-bar md-mode="indeterminate" v-if="sending"></md-progress-bar>
                    </md-dialog>
                    <md-dialog-alert :md-active.sync="banned"  md-content="Your Account has not been activated!"  md-confirm-text="Ok" />
                </div>
            `
        }
    },
});