##开发说明
- 样式的定义以-为分隔符，如：a-b-c；
- 组件中处理事件（onClick, onChange等）的方法，命名以handle为前缀,例如handleClick,handleTodoChange;
- 调用组件，如果需要传递多个属性，则分行显示；同理，import一个文件中多个对象时，同样分行显示;
- 页面import绝对定位的写在前面   相对定位的要空格一行再写

- api以页面的形势划分，并且以加下划线的形式命名api名称，并且首字母大写，每个api后面加注释，
  一个页面多个接口时这么命名，例如Home   Home_List  Home_Table and so on

- action的命名以英文你要以此actions去做的事来命名，例如我要触发这个action改变tab的状态时
  命名：export const changeMyTab = createAction('change my tab status')
  统一把描述的字符串信息,例如'change my tab status'放到actionType里面，便于在reducer里面引入
  详情请看actionType.js

- reducer的命名以我要得到的数据来命名  例如store返回给我的是刚才触发'change my tab status'的数据，
  PS(在reducer里面可以把刚才定义的变量名给引用过来)，那么我的reducer命名为tabData或者tabResult

更多参阅 [https://github.com/JasonBoy/javascript/tree/master/react](https://github.com/JasonBoy/javascript/tree/master/react)

