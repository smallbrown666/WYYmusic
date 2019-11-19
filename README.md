# WYYmusic
## 网易云音乐   移动端

使用方法：

1.使用git clone https://github.com/smallbrown666/WYYmusic.git 到本地

2.打开文件NeteaseCloudMusicApi  右键点击git Bash Here  输入命令:  node app.js    启动网易云本地服务器

3.点开index.html文件  按F12  选择移动端页面  

4.搞定  去看看吧！




## 1.1  准备工作

   1.你需要从手机屏幕上截下网易云APP的图，并且使用pxcook工具测量出每一处尺寸的大小，进行相应的尺寸标      		注。

   2.从阿里图标库里找到你需要的阿里图标并且下载到本地，这里推荐使用阿里云图标的第二种使用方法，简单方    		便，如果不知道怎么使用阿里图标，请参考阿里云图标官方文档。

  3.下载网易云API到本地 NeteaseCloudMusicApi (文件名)  ，你可以有git clone 至本地，也可以直接谷歌下载，		然后进入文件夹，空白处右键点击 Git Bash Here ，输入命令 ：  node app.js    这样你的后台程序就运行起		来了，当然这个只是用于本地测试，打开谷歌，输入：localhost：3000    即可，默认3000端口，如果你喜欢		4000端口，那就 输入命令： PORT=4000 node app.js   

### 1.2   页面布局 适配移动端

  1.添加rem进行适配

​     在head标签中添加代码： <meta name="viewport" content="width=320, initial-scale=1.0">

​	content=width=320 表示手机屏幕的宽度 最小也就320了，initial-scale = 1 ,缩放比为1，表示不进行页面缩放

   在script标签中添加代码：document.documentElement.style.fontSize = 100 * (window.innerWidth / 320 ) + 'px';

rem 指根标签的字体放大倍速 1 rem 就是1倍 100 * 表示时按照100像素来缩放的 window.innerWidth 表示设备的宽度  320 是手机的最小宽度  这样使用rem 就可以让宽高和文字随手机屏幕的大小而自然的改变大小 0.16rem 表示16px 按照手机为320px算

到此  rem 适配移动端结束。

2.HTML+CSS 这些基本的操作就不说了，用flex 弹性盒模型进行页面布局，为了防止盒子被撑大，在盒子的CSS属性中加入box-sizing: border-box;  让盒子成为一个怪异盒模型，避免出现bug。

3.将HTML , CSS , JS 代码分开写，以链接的方式引入，提高代码的维护性。

#### 1.3  JS 前后端数据交互

 1.本项目采用的是jquery中的ajax方法，因为是个人测试，所以选择了get请求的方式，请求的URL参考网易云API官方文档，里面有详细的接口介绍。

2.页面的首页采用了swiper轮播框架，图片数据来源于步骤1准备的服务器。

3.注释掉部分HTML代码，由JS来替代，项目代码里面由标注，如歌单列表。

其中index.html  和 recommend.html 我没有遇到什么难点，按部就班，页面+获取数据就搞定了，真正的难点在于第三个页面play.html播放页面。

#### 难点：如何让play播放页面获取到recommend被点击歌曲的数据？

要知道，我们做的是多页面的项目，不是VUE单页面的可以直接获取数据，页面跳转的时候，一刷新数据就没有了，如何解决这个难题，往下看~~

把recommend被点击的歌曲id挂载带一个对象datas的属性上，将AJAX的get请求地址改为

   http://localhost:3000/song/detail?ids=${datas.id}    用一个变量接收不同歌曲的id值，同时将接收到的这个变量传递给play播放在这个页面，以变量为媒介实现多个页面的数据共享！



还有一点，谷歌高版本浏览器不允许audio自动播放，换成低版本浏览器就好了！ 如：74版本的浏览器



至于点击播放暂停 ，以及进度条这些，我代码中有详细的注释，就不一一说明了！

​																												祝  生活愉快！





