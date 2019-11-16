window.onload= function(){
    // console.log(location.href);
    //获取图片元素
    let disc = $('.disc')[0];
    // console.log(disc)
    let playing = $('.playing')[0]
    // console.log(playing)
    let currentTime = $('.currentTime')[0];
    let mark = true;
    let duration = $('.duration')[0];
    // let datas = {};
    let proBg = $('.pro-bg')[0];
    let proBar = $('.pro-bar')[0];
    let progeess = $('.progeess')[0];

    //获取装歌词p标签的盒子
    let lyricWrap = $('.lyric-wrap')[0]


    //获取歌词
    let playWrap = $('.play-wrap')[0];

    (function(str){
        if(!str.includes('?')) return;
        let arr = str.split('?')[1].split('&');
        arr.forEach((item,index)=>{
            let dataArr = item.split('=');
            // datas[dataArr[0]] = dataArr[1];
            //使用本地储存的方式 （属性名，属性值） 和上一行代码一个意思
            if(dataArr[0] == 'id'){
                localStorage.setItem(dataArr[0],dataArr[1])
            }
        })
    })(location.href);
// console.log(datas)
    let datas = {};
    datas.id = localStorage.getItem('id')
    // console.log(datas);
    //播放音乐 需要一个全局的标签
    window._audio = document.createElement('audio');
    


    //获取歌曲详情   我们休要把id改变  上面做的工作都是为了获取id
    $.get(
        `http://localhost:3000/song/detail?ids=${datas.id}`,
        //这里是   直接解构你想要的数据 一步到位  首先解构songs 然后是songs数组的第0项然后解构al:  最后解构picUrl 注意格式 songs: {}   [al: {}]     {picUrl}
         function({songs: [{al: {picUrl}}]}){
            // console.log(picUrl);
           disc.innerHTML = `
           <img src="${picUrl}" alt="">
           `
        }
    );



    //根据id   获取对应的音乐播放
       $.get(
           `http://localhost:3000/song/url?id=${datas.id}`,
           function({data: [{url}]}){
            // console.log(url)
            disc.style.animation = 'rotate 10s linear infinite';
            _audio.src = url;
            //你单独打开这个页面是无法播放的 因为需要上一个页面的JS提供数据ID
            _audio.play();


            //监听音乐是否播放完毕 播放完毕时 触发事件函数  动画暂停
            _audio.addEventListener('ended',function(){
                disc.style.animation = '';
            })

            //监听播放
            _audio.addEventListener('timeupdate',function(){
                nowTime()
            });
            //播放时间
            function nowTime(){
                //总时间
                duration.innerHTML = time(_audio.duration);
                //当前时间
                currentTime.innerHTML = time(_audio.currentTime);
                //进度条
                let n = _audio.currentTime / _audio.duration;
                proBar.style.left = n * (progeess.offsetWidth - proBar.offsetWidth )/3.375/100+'rem'
                proBg.style.width = n * (progeess.offsetWidth - proBar.offsetWidth )/3.375/100+'rem'
            }
            //处理时间函数
            function time(cTime){
                cTime =parseInt(cTime);  // 小时
                let m = zero(Math.floor(cTime%3600/60)) //分
                let s = zero(Math.floor(cTime%60))   //秒
                return `${m}:${s}`
            }
           // 两位数时间格式
            function zero(num){
                return num < '10'? '0' + num : '' +num;
            }


            //处理控件  播放和暂停
            playing.onclick = function(){
                // console.log(1)
                let animation = '';
                let str = ''
                if(mark){
                    _audio.pause();
                    str ='icon-bofang1'
                }else{
                    _audio.play();
                    str = 'icon-zanting'
                    animation = 'rotate 10s linear infinite';
                    
                }
                mark = !mark;
                this.innerHTML = `
                 <span class="iconfont ${str}"></span>`
                disc.style.animation = animation

                return false;  //阻止事件冒泡
            }
            //点击获取歌词
            playWrap.onclick = function(){
              $.get(
                  `http://localhost:3000/lyric?id=${datas.id}`,
                  function({lrc: {lyric}}){
                      console.log(lyric)  //拿到歌词
                      let data = lyric.split('[');
                      console.log(data)   //将歌词切割成数组
                      data.forEach((item,index)=>{
                        // console.log(item)
                        if(!item) return;  //一个简单的判断方法  如果不存在item 直接return 反之走下面的命令  这样排除拿到空的歌词
                        // console.log(item)  // 用if 时因为歌词前面有一个空数组 要return出去

                        let dataArr = item.split(']');  //把第一项时间  和 歌词 分别拿出来
                        // console.log(dataArr);
                        //歌词的时间
                        let time = dataArr[0].split('.')[0];
                        // console.log(time)

                        //歌词的字符串
                        let lyricStr = dataArr[1];
                        // console.log(lyricStr)

                        let timeArr = time.split(':');
                        console.log(timeArr)
                        //得到毫秒数
                        let timer = timeArr[0]*60 + timeArr[1]*1
                        //通过for循环 创建P标签
                        let p = document.createElement('p')
                        p.id = 'ly' + timer
                        p.className = 'lyr'
                        p.innerHTML = lyricStr;
                        lyricWrap.appendChild(p);
                        disc.style.display = 'none';
                       } )

                      //获取所有的P标签
                      let pArr = ([...$('.lyr')]);//采用结构的方式
                      console.log(pArr)
           
                      //获取歌词p标签的当前时间
                      _audio.addEventListener('timeupdate',function(){
                        let currentTime = parseInt(_audio.currentTime);
                       //拿到每一个p标签
                        pArr.forEach((item,index)=>{
                            //如果id时间 = 当前时间 拼接 ly  就说明歌词和播放时间对应上了
                            if(item.id == 'ly' + currentTime){
                               //去除盒子的高度 让内容撑开高度
                                //给盒子一个-marginTop  实现让盒子从下往上滑动 播放歌词
                               lyricWrap.style.marginTop = -(item.offsetTop/100) + 'rem'
                              //实现歌词颜色按时间轮流变换 让播放过的歌词 恢复到以前的颜色
                    
                                if(index > 0 ){
                                    pArr[index-1].style.color = '#7f7676'
                                }
                              
                              
                              
                              
                               item.style.color = '#fff'
                            
                            }
                            
                        })





                      })
           
                    })

           }
        }
       )

}