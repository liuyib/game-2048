var iSpeed = 0;

function elasticAndRubSport(obj, iTarget) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        iSpeed += (iTarget - obj.offsetTop) / 5;  //弹性运动公式
        iSpeed *= 0.7;  //摩擦运动公式

        if (Math.abs(iSpeed) < 1 && Math.abs(iTarget - obj.offsetTop) < 1) {
            clearInterval(obj.timer);

            obj.style.top = iTarget + 'px';
        }
        else {
            obj.style.top = obj.offsetTop + iSpeed + 'px';
        }
    }, 30);
}