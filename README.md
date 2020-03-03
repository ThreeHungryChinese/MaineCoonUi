# MaineCoonUi
## Introductions
 A user Interface based on Vue.js
 
![Vue logo](/readme/logo.png)
### features
* Material Design User Interface
* COOL visible design for building a data flow
* Elegant Animations
* High completion level
## Demo
### Sample User:
For developters: developer@example.com | Password:123456

For School Administors: schooladmin@example.com | Password:123456

For Students: student@example.com | Password:123456

### Demo Link:
https://threehungrychinese.github.io/MaineCoonUi/
### Instructions & ScreenShots
#### For developer
After login the system, UI will look like this

![developer](/readme/developer.png)

Try it by clicking edit & New & Delete Button


#### For School Adminisator

After login the system, UI will look like this

![schooladmin](/readme/schooladmin.png)

Try it by clicking edit & New & Delete Button.

##### Set up program's data flow
In the Edit/Create dialog's third step, there is something like this

![flow](/readme/flow.jpg)

* As you can see, there are bubbles (*We call it dots*) on users screen. Blue dots represents this Programs' input which get from student's input and the output score of this flow. So this means the input dots must have a pointer to others and the output must be pointed from other dots.

* Other dots means a algorithm provided by developers. Users can click the add button in the top toobar to and a dot or delete button, then click a dot to delete one.

* If a user click a dot, its input setting table will show on the below. And the dot's color will change to orange, which shows this dot is selected.

* Once a user set all the input of a algorithm, it will change to green, which means this dot is set correctly.

* All dots are dragable, so if one are setting a huge data flow, they will find this feature is really useful.

#### For Student
After login the system, UI will look like this

![student](/readme/student.png)

click start to start a prediction.

## Deploy 
### Dependency
    "core-js": "^3.4.8",
    "vue": "^2.6.10",
    "vue-d3-network": "^0.1.28",
    "vue-material": "^1.0.0-beta-11",
    "vuebars": "^0.1.5",
    "vuelidate": "^0.7.4"
### Set up developing  Environment
#### First: Download a Node.js &  Environment
Check https://www.npmjs.com/get-npm to get instructions about how to install it on your OS

#### Second: Donwload Vue-Cli

(Reference https://cli.vuejs.org/)

`npm install -g @vue/cli`

#### Third: Launch Vue-Cli
Clone this repo.

To open this project, please just change your current dictionary of your terminal to the repo's root dictionary

And then,

`vue ui`

### Deploy on your own server
need a web server, like Apache || Nginx || IIS.

just link the index.html will not work since browser's CROS policy may block some essential resources.

#### Important information about CORS
Check to get information about [CROS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 
 
