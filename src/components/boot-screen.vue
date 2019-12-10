<template>

    <div style="
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        position:absolute;
    ">
    <slot></slot>
    </div>

        <!-- <h1>Pure CSS3 Animated Gradient Background</h1>
        <h2>
            by Manuel Pinto
            https://codepen.io/P1N2O/pen/pyBNzX
        </h2> -->
</template>

<script>
export default {

}
</script>

<style>
@keyframes gradientBG {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>