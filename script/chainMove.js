function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj, false)[attr];
    }
}
function chainMove(obj, attr, iTarget, fn) {
    clearInterval(obj.timer);

    obj.timer = setInterval(function () {
        var iCur = 0;

        if (attr == 'opacity') {
            iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
        }
        else {
            iCur = parseInt(getStyle(obj, attr));
        }

        var iSpeed = (iTarget - iCur) / 8;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

        if (iCur == iTarget) {
            clearInterval(obj.timer);

            if (fn) {
                fn();
            }
        }
        else {
            if (attr == 'opacity') {
                iCur += iSpeed;
                obj.style.filter = "alpha(opacity: " + iCur + ")";
                obj.style.opacity = iCur / 100;
            }
            else {
                obj.style[attr] = iCur + iSpeed + 'px';
            }
        }
    }, 10);
}