export class checkList {
    constructor() {}
    checkName(name, {
        empty,
        error
    } = callbackObj) {
        var reg = /^[\u4e00-\u9fa5a-zA-Z]{2,16}$/;
        if (name == '') {
            // alert('请输入姓名')
            empty && empty();
            return;
        }
        if (!reg.test(name)) {
            // alert('名字格式不正确')
            error && error();
            return false;
        } else {
            return true;
        }
    }
    checkPhoneNum(phoneNum, {
        empty,
        error
    } = callbackObj) {
        if (phoneNum == '') {
            // alert('请输入手机号');
            empty && empty();
            return;
        }
        if (!/^1[0-9][0-9]\d{8}$/.test(phoneNum)) {
            // alert('请输入正确的手机号码');
            error && error();
            return false;
        } else {
            return true;
        }
    }
    checkNumNotNull(num, alerTxt) {
        if (num == '' || num == 0) {
            alert(alerTxt || '数量不能为空');
            return false;
        } else {
            return true;
        }
    }
    checkCodeNum(codeNum, maxLen = 6, alerTxt) {
        if (codeNum == '' || codeNum.length != maxLen) {
            alert(alerTxt || '请输入验证码');
            return false;
        } else {
            return true;
        }
    }
}

// 参数
export function getQueryParameter(name) {
    // location.search
    let url = decodeURIComponent(location.href);
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    // return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    return results == null ? "" : decodeURIComponent(results[1]);
}

// 2个时间戳的差
export function getChangeTime(dateBegin, dateEnd) {
    let dateDiff = dateEnd - dateBegin; //时间差的毫秒数
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    let leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000)
    console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒")
    return {
        day: dayDiff,
        hours,
        minutes,
        seconds
    }
}

// 获取当前月的最大天数
export function getMonthMaxDate() {
    var curDate = new Date();
    var curMonth = curDate.getMonth();
    curDate.setMonth(curMonth + 1);
    curDate.setDate(0);
    return curDate.getDate();
}

// 验证码倒计时
export const timeCountDown = function () {
    let smsCodeData = {
        changeSmsCode: "获取验证码",
        smsCodenowTime: 60,
        smsCodemaxTime: 60,
        smsCodetTime: "" // 获取的时间
    };
    let st = "";

    let _refreshSmsCodeData = function (_this) {
        clearTimeout(st);
        smsCodeData = {
            changeSmsCode: "获取验证码",
            smsCodenowTime: 60,
            smsCodemaxTime: 60,
            smsCodetTime: ""
        };
        _this.isGetSmsCode = false;
    };

    let _startChangeTime = function (_this, callback) {
        if (smsCodeData.smsCodetTime == null) {
            smsCodeData.smsCodetTime = new Date().getTime();
        } else {
            let t2 = new Date().getTime();
            // console.log(t2 - smsCodeData.smsCodetTime);
            if (
                t2 - smsCodeData.smsCodetTime <
                smsCodeData.smsCodemaxTime * 1000
            ) {
                smsCodeData.smsCodetTime = t2;
                return false;
            } else {
                smsCodeData.smsCodetTime = t2;
            }
        }
        callback && typeof callback === "function" && callback();
        _changeTimeNext(_this);
    };

    let _changeTimeNext = function (_this) {
        let changeSmsCode = "smsCodeData.changeSmsCode";
        if (smsCodeData.smsCodenowTime == 0) {
            smsCodeData.changeSmsCode = "获取验证码";
            smsCodeData.smsCodenowTime = smsCodeData.smsCodemaxTime;
            smsCodeData.smsCodetTime = "";

            _this.isGetSmsCode = false;
            _this.getSmsCodeTime = smsCodeData.smsCodenowTime + "s";

            clearTimeout(st);
        } else {
            smsCodeData.changeSmsCode = smsCodeData.smsCodenowTime;

            _this.getSmsCodeTime = smsCodeData.smsCodenowTime + "s";

            smsCodeData.smsCodenowTime--;

            st = setTimeout(function () {
                _changeTimeNext(_this);
            }, 1000);
        }
    };
    return {
        startChangeTime: function (_this, callback, errCallback) {

            if (_this.isGetSmsCode) {
                console.log("已经获取了");
                errCallback && errCallback()
                return false;
            } else {
                console.log("开始获取");
                _startChangeTime(_this, callback);
                _this.isGetSmsCode = true;
                return true;
            }
        },
        refreshChangeTime: function (_this, callback) {
            console.log("重新计时");
            _refreshSmsCodeData(_this);
        }
    };
}
// if (!this._Utils.timeCountDown().startChangeTime(this, {}, () => {
//     this.$toast("验证码已发送");
// })) return;

export const $An = {
    //淡入
    fadeIn(e, {
        frameSpeed = 20,
        callback,
        fadeInOpacityNum
    } = {}) { //ref
        let _this = this;
        let _style = e.currentStyle || getComputedStyle(e)

        // console.log('样式', _style.display)
        //提前return
        if (e.style.fadeOutAn) return;
        if (_style.display == 'block' && _style.opacity == 1) return;

        e.style.fadeInAn = true;
        e.style.opacity ?
            ((e.style.opacity = fadeInOpacityNum.next().value) >= 1 ?

                (e.style.fadeInAn = false, callback && callback.bind(this)()) :
                setTimeout(() => {
                    _this.fadeIn(e, {
                        frameSpeed,
                        callback,
                        fadeInOpacityNum
                    })
                }, frameSpeed)) :
            (fadeInOpacityNum = _this.fadeInOpacity(e.style.opacity, 10),
                e.style.opacity = fadeInOpacityNum.next().value,
                e.style.display = "block",
                _this.fadeIn(e, {
                    frameSpeed,
                    callback,
                    fadeInOpacityNum
                }))
    },
    * fadeInOpacity(val, maxVal) {
        var index = val * 10;
        while (index <= maxVal)
            yield(index++) / 10;
    },
    //淡出,多参数,回调及this绑定
    fadeOut(e, {
        frameSpeed = 20,
        callback
    } = {}) { //ref
        let _this = this;
        let _style = e.currentStyle || getComputedStyle(e)

        if (e.style.fadeInAn) return;
        if (_style.display == 'none') return;

        e.style.fadeOutAn = true;
        e.style.opacity ?
            ((e.style.opacity -= 0.1) <= 0 ?

                (e.style.display = "none", e.style.opacity = "", e.style.fadeOutAn = false, callback && callback
                    .bind(this)()) :
                setTimeout(() => {
                    _this.fadeOut(e, {
                        frameSpeed,
                        callback
                    })
                }, frameSpeed)) :
            (e.style.opacity = 1, _this.fadeOut(e, {
                frameSpeed,
                callback
            }))
    },
}
// this.Utils.$An.fadeOut(this.$refs.showDetailBox, {
//     callback: () => {}
// })

export const $Dom = {
    getStyle(e, style) {
        let _style = e.currentStyle || getComputedStyle(e)
        return _style[style];
    },
}

/**
 * 资源加载类
 */
export class Class_LoadImgSource {
    constructor(options) {
        this.options = options

        // if (!options.ele) {
        //     console.error('load ele is not defined')
        //     return
        // }

        this.$ele = options.ele || ''
        this.callback = options.callback

        this.isTest = options.isTest || false
        this.beforeLoadArr = options.beforeLoadArr || ''
        this.imgLoadArr = options.imgLoadArr || ''


        this.progress = 0
        this.loadImg_num = 0
        this.loadv_num = 0
        this.img_progress = 0
        this.v_progress = 0

        this.load_time = 0
        this.mixload_time = options.mixload_time || 2000
        this.afterloadNextStep_time = options.afterloadNextStep_time || 500
        // this.maxload_time = 0

        if (this.beforeLoadArr) {
            this.beforeLoad(this.onStart.bind(this))
        } else {
            this.onStart()
        }
    }

    get_loadImg_progress(imgp, src) {
        this.img_progress = imgp * 100
        this.update(this.img_progress, src)
    }

    set_progress(new_progress) {
        this.progress = new_progress
    }

    get_porgress() {
        return Math.floor(this.progress)
    }

    is_mixlimit_loadtime() {
        return this.load_time > this.mixload_time
    }
    //最低加载时间
    get_mixload_time() {
        return this.mixload_time
    }
    //总加载时间
    get_loadtime() {
        return this.load_time
    }
    //加载完后执行下一步的等待时间
    get_loadNextStep_time() {
        return this.is_mixlimit_loadtime() ? this.afterloadNextStep_time : this.get_mixload_time() - this.get_loadtime()
    }

    update(progress, src) {
        this.set_progress(progress)
        this.onProgress(src)
        if (this.get_porgress() >= 100) {
            this.onLoad()
        }
    }

    test() {
        var st = setInterval(() => {
            if (this.get_porgress() >= 100) {
                clearInterval(st)
                this.onLoad()
            } else {
                this.set_progress(++this.progress)
                this.onProgress()
            }
        }, 20)
    }

    beforeLoad(callback) {
        let imgLoadArr = this.beforeLoadArr,
            len = this.beforeLoadArr.length,
            loadImg_num = this.loadImg_num;

        imgLoadArr.map((item, index) => {
            var img = new Image()
            img.onload = () => {
                loadImg_num++
                if (loadImg_num == len) {
                    callback && callback()
                }
            }
            img.onerror = () => {
                loadImg_num++
                if (loadImg_num == len) {
                    callback && callback()
                }
            }
            img.src = item
        })
    }

    onStart() {
        this.options.onStart && this.options.onStart()
        this.load_time_start = new Date() * 1
        if (this.isTest) {
            this.test()
            this.onLoadImg()
        } else {
            this.onLoadImg()
        }
    }
    onLoadImg() {
        let imgLoadArr = this.imgLoadArr,
            len = this.imgLoadArr.length,
            loadImg_num = this.loadImg_num;

        imgLoadArr.map((item, index) => {
            var img = new Image()
            img.onload = () => {
                loadImg_num++
                if (!this.isTest) {
                    this.get_loadImg_progress(loadImg_num / len, item)
                }
            }
            img.onerror = () => {
                loadImg_num++
                if (!this.isTest) {
                    this.get_loadImg_progress(loadImg_num / len, item)
                }
            }
            img.src = item
        })
    }
    onProgress(src) {
        this.options.onProgress && this.options.onProgress({
            $ele: this.$ele,
            item: this.isTest ? src : '',
            progress: this.get_porgress()
        })
    }
    onLoad() {
        this.load_time_end = new Date() * 1
        this.load_time = this.load_time_end - this.load_time_start

        this.options.onLoad && this.options.onLoad()
    }
}

// this.myload = new this.Utils.Class_LoadImgSource({
//     ele: this.$refs.showProgress,
//     isTest: true,
//     beforeLoadArr: this.imgbeforeLoadArr,
//     imgLoadArr: this.imgLoadArr,
//     mixload_time: '1500',
//     afterloadNextStep_time: '500',
//     onStart: () => {},
//     onProgress: (obj) => {
//         const {
//             $ele,
//             item,
//             progress
//         } = obj
//         this.progressNum = progress + '%'
//         $ele.style['webkitMaskImage'] = '-webkit-linear-gradient(-22deg, transparent ' +
//             progress + '%, white 0%)';
//     },
//     onLoad: () => {
//         let isLoad_t = this.myload.get_loadNextStep_time()
//         console.log('img加载完成', 'use:', this.myload.get_loadtime(), 'need:', isLoad_t)

//         setTimeout(() => {
//             this.isLoad = true
//             this._GLOBAL.eventBus.$emit('isLoad')
//         }, isLoad_t)
//         // this.$emit('listenloadevent', 'onload')
//     }
// })