window.onload = function(){
let recHead = $('.rec-head')[0];
let recList =$('.rec-list')[0];
let idList = [];
let imgList = [];
let nameList = [];
//定义一个空数组  接收由获取音乐push 过来的id值
// console.log(item)
//    console.log(recHead)   
//音乐组件部分 这个写才playing.forEach 函数里面 点击出现播放栏目
let control = $('.control')[0];
    console.log(control)
//获取推荐图片
    $.get(
        'http://localhost:3000/banner',
        function({banners}){
            // console.log(banners)
            recHead.innerHTML = '';
            recHead.style.background = `url(${banners[Math.floor(Math.random()*8)].imageUrl}) no-repeat 0 0/auto 100%`
        }
    )

    //获取推荐音乐
    
    $.get(
        'http://localhost:3000/personalized/newsong',
        function({result}){
            // console.log(result)
            recList.innerHTML = '';
            result.forEach((item,index)=>{
                //通过在for循环里面 拿到每一首歌曲的ID值 后期就能播放对应的歌曲
                idList.push(item.id)
                imgList.push(item.song.album.picUrl)
                nameList.push(item.name)
                recList.innerHTML += ` 
                <li class="rec-item">
                <a class = 'playing' href="#">
                    <div class="item-info">
                        <div class="info-img">
                            <img src="${item.song.album.picUrl}" alt="">
                        </div>
                        <div class="info">
                            <div class="info-title">
                            ${item.name}
                            </div>
                            <div class="info-desc">
                                夏日入侵企划-极恶都市
                            </div>
                        </div>
                    </div>
                    <div class="item-play">
                        <span class="iconfont icon-bofang1"></span>
                        <span class="iconfont icon-yuandiancaidan"></span>
                    </div>
                </a>
            </li>
            `
                // console.log(idList)

            });
            //必须在AJAX请求内打印数据 不能和AJAX平级  因为JS是异步的 会先打印然后再去获取get数据
            // console.log(idList)
            // console.log(imgList)
            // console.log(nameList)
            // console.log([...$('.playing')])  这个就是将类数组转换为数组
           let playing = [...$('.playing')];
           window._audio = document.createElement('audio')    //将标签挂在window 上 完美解决 歌曲乱播的BIG  需要注意的是 就算挂载window上 也必须在AJAX请求内  不然这句代码将毫无意义 还会报错
           //给每一个歌曲id添加点击事件  用forEach 因为id是动态的 所以要在函数内再加一个AJAX请求 来获取变换的歌单
           playing.forEach((item , index)=>{
               //不能直接用index当作点击事件的下标 JS是异步执行的 点击事件是当用户点击的时候才会触发 所以用绑定下标自定义属性的方式
            //    let audio = document.createElement('audio')
               item.index = index;
               item.onclick= function(){
                control.style.display = 'block'; // 播放栏显示是和GET平级的
                    $.get(
                        `http://localhost:3000/song/url?id=${idList[this.index]}`,
                         function({data}){
                            // console.log(data)  //拿到点击相关id的全部date数据 加上{} 解构它 变成数组  date[0] 固定的
                            // console.log({data})
                            _audio.src = data[0].url
                            _audio.play()
                            //这个时候出问题了 我们的audio标签是存放在forEach这个函数里面的 这时候我们连续点击不同的歌曲 会出现上一首歌曲还在播放 多首歌曲同时播放的BUG 为了解决这个BUG 我们要将audio这个标签挂载到window上面 这样我们每次点击都只是给歌曲切换了不同的路径 这样就实现了歌曲的播放切换 至于单曲循环 列表循环之类的  在另写
                        }

                    );//这是请求ID 和audio的  写新的区块功能需要;结束后再写

                     //音乐组件  这里的
                            control.style.display = 'block';
                            control.innerHTML = `  
                            <a href="./play.html?id=${idList[this.index]}">  <!--这一步非常关键 处理play.html 多页面的数据传输 让另一个页面能接收到其他页面的数据-->
                            <div class="control-content">
                                <div class="con-img">
                                    <img src="${imgList[this.index]}" alt="">
                                </div>
                                <div class="con-info">
                                    <div class="con-title">
                                       ${nameList[this.index]}
                                    </div>
                                    <div class="con-desc">
                                        滑动切换音乐
                                    </div>
                                </div>
                            </div>
                
                            <div class="con-play">
                                <div class="con-playing">
                                    <span class="iconfont icon-zanting
                                    "></span>
                                </div>
                                <span class="iconfont icon-bofangliebiao
                                "></span>
                            </div>
                        </a>`
               }
           })


        }
    )
}


/*如何保证让用户所点击播放的歌曲   就播放用户点击的歌曲
    1.获取出现在页面的歌单元素ID  
    2.将类数组转换为数组  将获取的数据 =>  [...数据]  OK了



*/