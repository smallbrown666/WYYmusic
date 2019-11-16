
window.onload = function(){
    let swiper = $('.swiper')[0];
    let dislist = $('.dis-list')[0];  //ul 盒子
    // console.log(swiper)
    //banner
    $.get(
        'http://localhost:3000/banner',
        function({banners}){
            // console.log(banners)
           let swiperWrap = ''
            banners.forEach((item, index) => {
                /* item 每一项 index 下标 */
                swiperWrap += `
                <div class="swiper-slide">
                    <img class='banner-img' src = '${item.imageUrl}'>
                    <span class = 'banner-imgtype' style = 'background-color:${item.titleColor}'> 
                    ${item.typeTitle}</span>
                </div> 
                `;
            })
            swiper.innerHTML = `
            <div class="swiper-container">
                 <div class="swiper-wrapper">
                       ${swiperWrap}   
                </div>
                  <div class="swiper-pagination"></div>
                 </div>`

                new Swiper('.swiper-container', {
                    autoplay:2000,
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                    });
            
        }
    );




    //discover
    $.get(
        'http://localhost:3000/personalized',
        function({result}){
            console.log(result)
            //循环数据之前 需要清空ul盒子
            dislist.innerHTML = ''
            result.forEach((item , index)=>{
                if(index < 6){
                    console.log(item)
                    //JS的动态交互 在UL盒子里面直接添加li盒子
                    dislist.innerHTML += `
                    <li class="dis-item">
                    <a href="#">
                      <div class="dis-img">
                        <img src="${item.picUrl}" alt="">
                      </div>
                      <div class="dis-desc">
                        ${item.name}
                      </div>
                    </a>
                  </li>
                    `


                }
            })
        }
    )
}





/*
    使用get请求  url, function(date) 这个date返回的是所有的参数 而我执行需要date里面的 banners 这个数组里面的数据
    重点来了   利用AJAX 获取后台数据 并由JS生成 DIV 来展示轮播
    1.通过函数获取到 轮播框swiper-wrapper
    2.利用forEach(item,index)  获取到轮播框里面的 每一个div盒子  并且在盒子里面添加img标签 
 
    总结：
        1.在页面加载完成后 直接获取轮播最外层的盒子来操作 swiper
        2.通过GET请求 获取后台数据 UTL  ， callback回调
        3.在函数中定义一个变量为空  再通过forEach 拿到后台的imageUrl  在swiper-slid 中添加一个img标签 路径为{item.imageUrl}
        4.最后再把swiper轮播框架放入事先准备的盒子innerhtml中 参考19行代码搞定
        5.再把swiper的运行JS代码放在最后 搞定！~
 
 
        重点 说一下function(date){console.log(date)} 这个AJAX请求拿到拿到是一整个数据 调用需要date.xxx属性  
                  function({resylt}){console.log(result)}  在形参放入数组 这个就是解构的方式 能直接拿到date.XXX属性 名字就是XXX属性
                  解构拿到的是数组对象 直接用forEach()
    */