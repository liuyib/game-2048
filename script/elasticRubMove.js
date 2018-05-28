var iSpeed = 0;

function elasticRubMove(obj, iTarget) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        iSpeed += (iTarget - obj.offsetTop) / 5;  //弹性运动
        iSpeed *= 0.7;  //摩擦运动

        if (Math.abs(iSpeed) < 1 && Math.abs(iTarget - obj.offsetTop) < 1) {
            clearInterval(obj.timer);

            obj.style.top = iTarget + 'px';
        }
        else {
            obj.style.top = obj.offsetTop + iSpeed + 'px';
        }
    }, 30);
}