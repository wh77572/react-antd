## 技术栈

react@16.0 + redux@3.7.2 + react-router@3.2.0 + webpack@3.10.0 + fetch@2.0.3 + less@2.7.1 + antd@3.1.3

```
npm install  (安装依赖包)
npm start (运行本地开发环境)
npm run build (打包)

另开启一个命令窗口 启动node的本地json数据代理服务
npm run mock

想要体验聊天室功能  先开启socket服务 运行命令
npm run chat

```
服务端返回数据结构格式

```
{
  data: {
    totalCount: 100,
    currentPage: 1,
    pageSize: 10,
    'list': [
    ],
  },
  msg: '',
  status: 1,
}

```
所有异步请求返回都会经过utils里面的index.js做处理，如果请求没有任何问题，那status返回值是1；
如果请求错误，比如说参数错误或者其他报错之类的，那status返回值就是0；
如果status值是-1，表示登录超时，那么就会跳出登录。
这些参数都可以根据实际情况进行调整，报错或者成功的提示信息放在msg里面返回，
用户可以自己控制是否显示出来，详情实例参照mock/datas/tableList.js的数据返回格式

### 取消http请求示例：
```
import axios from 'axios'
const axiosHandle = axios.CancelToken.source()
login(){
  this.props.ch(fetchLogin(values, (res) => {},(error)=>{},axiosHandle)
  取消请求的操作
  setTimeout(() => {
    axiosHandle.cancel('手动取消。')
  }, 3000)
}

```

