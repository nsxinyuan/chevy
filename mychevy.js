const cookieName = 'mychevy'
const signurlKey = 'senku_signurl_mychevy'
const signheaderKey = 'senku_signheader_mychevy'
const signbodyKey = 'senku_signbody_mychevy'
const senku = init()
const signurlVal = senku.getdata(signurlKey)
const signheaderVal = senku.getdata(signheaderKey)
//const signBodyVal = senku.getdata(signbodyKey)

sign()

function sign() {
    const url = {url: signurlVal, headers: JSON.parse(signheaderVal)/*, body: signBodyVal*/}
    //将post改成get
    senku.get(url, (error, response, data) => {
    //将get请求的结果用JSON.parse(),将json数据转化为JavaScript对象
        const result = JSON.parse(data)
        //const total = result.data['task.revisionSignInGetAward'].total
       // const ret = result.data['task.revisionSignInGetAward'].ret
       
       const code = result.code//code=200成功，code=3001失败或重复
       //const result1 = result.datas.result//签到结果
       const now_points = result.datas.now_points//签到积分
       const points = result.datas.points//总积分
       const extra_points = result.datas.extra_points//随机积分
       const all_sign_count = result.all_sign_count//年签到天数
       const all_month_sign_count = result.month_sign_count//月签到天数
       const continuous_sign_count = result.continuous_sign_count//连续签到天数
       
       
        let subTitle = ``
        let detail = ``
        /*if (total != 0) {
            const num = result.data['task.revisionSignInGetAward'].awards[0].num
            subTitle = `签到结果: 成功`
            detail = `获得鲜花: ${num}朵,已连续签到:${total}天`
        } else if (ret == -11532) {
            subTitle = `签到结果: 成功 (重复签到)`
        } else {
            subTitle = `签到结果: 失败`
        }*/
        
        if (code == 200) {
           subTitle = `签到结果: 成功`
           detail = `每日签到奖励: ${now_points}积分,随机积分:${extra_points}积分,累计积分:${points}积分,累计签到:${continuous_sign_count}天,月累计签到:${all_month_sign_count}天,年累计签到:${all_sign_count}天`
        }else if (code == 3001) {
        subTitle = `签到结果: 重复签到`
        }else {
            subTitle = `签到结果: 失败`
         }
        
        senku.msg(cookieName, subTitle, detail)
        senku.done()
    })
}

function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return {isSurge, isQuanX, msg, log, getdata, setdata, get, post, done}
}
