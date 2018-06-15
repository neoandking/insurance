import alt from 'bases/Alt.js';
import querystring from "querystring";
import jsonp from "jsonp";
import CustomerAction from '../actions/CustomerAction';
import {Notify} from "components/common/Common";
import {xFetch,xPostFetch} from "../../services/xFetch";

//************************ 用于打印log的 **************************
const show = (info) => {
  console.log("store LoanListStore: " + info);
}
const momentTansfer = (data)=>{
  let format="YYYY-MM-DD";
  if(data.carBuyDate!=null&&data.carBuyDate!='') {
    data.carBuyDate = data.carBuyDate.format(format);
  }
  if(data.policyEffectDate!=null) {
    data.policyEffectDate = data.policyEffectDate.format(format);
  }
  if(data.policyExpireDate!=null) {
    data.policyExpireDate = data.policyExpireDate.format(format);
  }
  return data;
}
//****************************************************************
class CustomerStore {
  constructor() {
    this.bindListeners({
      handleInitDataList: CustomerAction.initDataListInfo,
      handleQuerySubmit: CustomerAction.querySubmit,
      handlePagination: CustomerAction.setPagination,
      handleOpenAddModal: CustomerAction.openAddModal,
      handleOpenUpdateModal: CustomerAction.openUpdateModal,

      handleAddLoan: CustomerAction.addLoan,
      handleUpdateLoan: CustomerAction.updateLoan,
      handleImportCustomer:CustomerAction.importCustomer


    });
    this.state = {
      dataList: [],
      loading: true,
      typeList : [],
      addModalVisible : false,
      customerInfo:{},
      id:null,
      successCount:0,
      pagination: {
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      params: {},
    };
  }


  handleInitDataList = (pager) => {
    this.handleQuerySubmit({pager: pager,data:{status:'ON'}});
  };

  handlePagination = (pager) => {
    this.handleQuerySubmit({data: this.state.params, pager: pager});
  };

  handleAddLoan = (data) =>{
    data = momentTansfer(data);
    let param = querystring.encode(data);
    console.log("add:"+param)
    xPostFetch(SERVER_URL + '/customer/addCustomer?'+param).then(result => {
      if (result && result.success) {
        Notify('添加成功', result.msg, 'success');
        this.handleOpenAddModal();
        this.handleQuerySubmit({data: this.state.params, pager: {page:this.state.page,pageSize:this.state.pageSize}});
      } else{
        Notify('添加发生异常', result.msg, 'error');
      }})
  };
  handleUpdateLoan = (data) =>{
    data.id=this.state.id;
    data = momentTansfer(data);
    let param = querystring.encode(data);
    console.log("update:"+param);
    xPostFetch(SERVER_URL + '/customer/updateCustomer?'+param).then(result => {
      if (result && result.success) {
        Notify('修改成功', result.msg, 'success');
        this.handleOpenAddModal();
        this.handleQuerySubmit({data: this.state.params, pager: {page:this.state.page,pageSize:this.state.pageSize}});
      } else{
        Notify('添加发生异常', result.msg, 'error');
      }})
  };

  handleOpenAddModal =() =>{
    console.log("进入store");
    let visible = !this.state.addModalVisible;
    console.log(visible);
    this.setState({
      addModalVisible : visible,
      customerInfo:{},
      id:null
    });
  };

  /**
   * 导入客户
   * @param data
   */
  handleImportCustomer =(data)=>{
    xPostFetch(SERVER_URL + '/customer/importXsl','xslPath='+data.xslPath).then(result => {
      if (result && result.success) {
        show("get Info OK");
        // this.setState({successCount: result.data});
        Notify('客户导入成功', '总共导入:'+result.data+'条客户数据', 'success');
      } else{
        Notify('导入客户数据发生异常', result.msg, 'error');
      }})

  }
  //打开修改窗口
  handleOpenUpdateModal =(data) =>{

    console.log("loanId:"+data.loanId);
    let visible = !this.state.addModalVisible;
    console.log(visible);
    this.setState({addModalVisible : visible});
    xFetch(SERVER_URL + '/customer/getInfo?id='+data.id).then(result => {
      if (result && result.data) {
        show("get Info OK");
        this.setState({customerInfo: result.data,id:data.id});
      } else{
        Notify('请求明细数据发生异常', result.msg, 'error');
      }})

  };


  handleQuerySubmit = (data) => {
    this.setState({loading:true});
    let queryParam = querystring.encode(data.data) + "&" + querystring.encode(data.pager);
    show(SERVER_URL + '/customer/getList?'+queryParam)
    xFetch(SERVER_URL + '/customer/getList?'+queryParam).then(result => {
      if (result && result.data) {
        show("OK");
        this.state.pagination.total = result.data.totalNumber;
        let pagination = this.state.pagination;
        pagination.pageSize = data.pager.pageSize;
        pagination.current = data.pager.page;
        this.setState({pagination: pagination});
        this.setState({dataList: result.data.items});
        this.setState({totalNumber: result.data.totalNumber});
        this.setState({pageSize: data.pager.pageSize});
        this.setState({page: data.pager.page});
        this.setState({loading:false});
        this.setState({params:data.data});
      } else{
        show("请求列表发生异常");
        Notify('请求列表发生异常', result.msg, 'error');
      }})
  }


}

export default alt.createStore(CustomerStore, 'CustomerStore');
