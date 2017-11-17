/**
 * v 0.1.0(demo) β版
 */
 (function(){
   var resources = ['css/contacts.css'], //需要被自动引入的资源css or js, 位置相对于当前文件;
     jsPath = function() {
       var js = document.scripts,
         jsName = 'contacts.js';//主文件name，用于判断路径
         curJs = null,
         curJsSrc = null,
         curJsName = null;
       for (var i = 0; i < js.length; i++) {
         curJs = js[i];
         curJsSrc = curJs.src;
         curJsName = curJsSrc.substring(curJsSrc.lastIndexOf('/') + 1, curJsSrc.length);
         if (curJsName == jsName) {
           return curJsSrc.substring(0, curJsSrc.lastIndexOf('/') + 1);
         };
       };
     }(),
     head = document.getElementsByTagName('head')[0];
   for (var i = 0; i < resources.length; i++) {
     var link = document.createElement('link');
     link.rel = 'stylesheet';
     link.href = jsPath + resources[i];
     head.appendChild(link);
   };
 })();

(function(win){
  /**
   * 元素选择器
   */
  var $g = function(string) {
    if (string[0] == '#') {
      return document.getElementById(string.replace('#', ''));
    }else {
      return document.querySelector(string);
    };
  },
  /**
   * 返回指定元素的符合要求的父级(包含自身)
   * 类似于closest()
   * attribut{
   *   class: .abc,
   *   id: #abc,
   *   tag: li,
   * }
   */
  $gp = function(el, attribute) {
    var type = 't';
    if(attribute[0] == '.') type = 'c';
    if(attribute[0] == '#') type = 'i';
    var $child = el;
    var $parent = '';
    function lp() {
      $parent = $child;
      if ($parent.tagName == 'HTML') return $parent = undefined;
      $child = $parent.parentNode;
      if (type == 'c' && $parent.classList.contains(attribute.replace('.', ''))) {
        return $parent;
      }else if(type == 'i' && $parent.id == attribute.replace('#', '')){
        return $parent;
      }else if(type == 't' && $parent.tagName.toLocaleLowerCase() == attribute){
        return $parent;
      }else {
        lp();
      };
    };
    lp();
    return $parent;
  },
  /**
   * 创建dom元素
   */
  $c = function(el) {
    return document.createElement(el);
  },
  /**
   * children()
   */
  $cd = function(el){
    var children = el.childNodes,
      childrenLen = children.length,
      childrenArray = [];
    for (var i = 0; i < childrenLen; i++) {
      if (children[i].nodeType == 1) childrenArray.push(children[i]);
    };
    return childrenArray;
  },
  /**
   * 向dom添加元素
   */
  $ad = function(el, child) {
    el.appendChild(child);
  },
  /**
   * 删除dom内的元素
   * index从1开始
   * index为1,全删,2就从第二个开始(包括第二个);
   */
  $rd = function(el, index, isDuo) {
    var navChilds = $cd(el),
      navChildsLength = navChilds.length;
    if (navChildsLength && !index) {
      for (var i = 0; i < navChildsLength; i++) {
        el.removeChild(navChilds[i]);
      };
    }else if(index && isDuo){
      for (var i = index; i < navChildsLength+1; i++) {
        el.removeChild(navChilds[i-1]);
      };
    }else if(index){
      el.removeChild(navChilds[index-1]);
    };
  },
  /**
   * 绑定方法
   */
  $on = function(el, event, fn) {
    el.addEventListener(event, fn, false);
  },
  /**
   * 解绑方法
   */
  $off = function(el, event, fn) {
    el.removeEventListener(event, fn, false);
  },
  /**
   * 设置className
   */
  $an = function(el, name) {
    el.className = name;
  },
  /**
   * 设置属性
   */
  $sab = function(el, bute, value) {
    el.setAttribute(bute, value);
  },
  /**
   * show
   */
  $show = function(el, type) {
    el.style.display = type == undefined ? 'block' : 'inline-block';
  },
  /**
   * hide
   */
  $hide = function(el) {
    el.style.display = 'none';
  },
  allowCreactHtml = true, //是否允许插件往DOM内插入html
  configAll = {
    departSelected: false,
    totalAjaxCount: 0
  }; //插件全局参数
  /**
   * 本体
   */
  win.Contacts = function(element, params){
    this.el = element;
    this.$el = $g(element);
    if(!this.$el) return;
    this.init(params);
  };
  /**
   * 初始化方法
   */
  Contacts.prototype.init = function(params){
    var ct = this;
    /**
     * 参数&初始值
     */
    ct.ot = { //opts
      contactId: params && params.contactId || null,
      selectType: params && params.selectType || 'checkbox',
      departEnable: params && params.departEnable || true,
      departSelect: params && params.departSelect || 'checkbox',
      personEnable: params && params.personEnable || true,
      personSelect: params && params.personSelect || 'checkbox',
      personNameShow: params && params.personNameShow || true,
      backBtnShow: params && params.backBtnShow || false,
      confirmBtnName: params && params.confirmBtnName || '确认',
      myDepartmentId: params && params.myDepartmentId || -1,
      selectSt: params && params.selectSt || undefined,
      selectEn: params && params.selectEn || undefined
    };
    ct.$el.webrischa = true;
    $on(ct.$el, 'click', function(){
      configAll.opts = ct.ot;
      showContacts();
    });
  };//initEnd

  //搜索
  function searchContacts(){
    configAll.keyWords = configAll.$input.value.replace(/(^\s*)|(\s*$)/g, '');
    if (!configAll.keyWords) return;
    configAll.departSelected = false;
    searchItem();
  };//searchContactsEnd

  //生成搜索页面
  function searchItem(){
    delDepartStaff(); //清空部门、人员列表
    $hide(configAll.$searchNodata); //隐藏搜索无结果的样式
    //生成导航栏
    $rd(configAll.$navList, 2, true);
    var $searchItem = configAll.$navItem.cloneNode();
    $searchItem.innerHTML = '搜索';
    $searchItem.id = 'searchNavBtn';
    $searchItem.index = $cd(configAll.$navList).length+1;
    $on($searchItem, 'click', function(){
      if(this.index == $cd(configAll.$navList).length) return;
      var nextIndex = this.index + 1;
      $rd(configAll.$navList, nextIndex, true);
      delDepartStaff();
      $hide(configAll.$searchNodata); //隐藏搜索无结果的样式
      configAll.departSelected = false;
      searchAjax(1);
    });
    $ad(configAll.$navList, $searchItem);
    //获取搜索内容
    searchAjax(1);
  };//indexItemEnd


  //人员搜索滚动加载
  function staffSearchMore(){
    configAll.scrollTop = window.scrollY;
    configAll.docHeight = document.body.parentNode.offsetHeight;
    configAll.windowHeight = window.innerHeight;
    if (configAll.docHeight - (configAll.scrollTop+configAll.windowHeight) < 50) {
      searchAjax(configAll.pageSearchIndex, true);
    };
  };

  //人员滚动加载
  function staffAjaxMore(){
    configAll.scrollTop = window.scrollY;
    configAll.docHeight = document.body.parentNode.offsetHeight;
    configAll.windowHeight = window.innerHeight;
    if (configAll.docHeight - (configAll.scrollTop+configAll.windowHeight) < 50) {
      getAjax(configAll.departmentId, configAll.pageListIndex, true);
    };
  };

  //搜索ajax
  function searchAjax(pageIndex, personOnly){
    configAll.totalAjaxCount++;
    $off(window, 'scroll', staffSearchMore);
    $off(window, 'scroll', staffAjaxMore);
    $.ajax({
      url: 'http://localhost:3004/nodata',
      type: 'GET',
      dataType: 'json',
      data: {
        keyWords: configAll.keyWords,
        pageIndex: pageIndex || 1,
        personOnly: personOnly || false,
        totalAjaxCount: configAll.totalAjaxCount
      },
      /**
       * data = {
       *   "success": true,
       *   "totalAjaxCount": 1  //由前端传回后台，后台再原样返回，为了防止ajax内容再网速慢的情况下加载出错
       *   "obj": {
       *     "departments": [{
       *       "id": 1,
       *       "name": "杭州博科思科技有限公司"
       *     }],
       *     "personPage": {
       *       "pageIndex": 1,
       *       "isHasNextPage": false,
       *       "items":[{
       *         "id": 100001,
       *         "name": "赵一",
       *         "logo": "http://img.51vj.cn/headImg/logo.png",
       *         "headImage": "http://img.51vj.cn/headImg/logo.png",
       *         "jobs": "经理",
       *         "mobileFir": "18758635789"
       *       }]
       *     }
       *   }
       * }
       */
      success: function(data){
        //if(data.totalAjaxCount != configAll.totalAjaxCount) return;  //正式环境请不要注释(除非后台没有返回totalAjaxCount)
        var obj = data.obj,
          departments = obj.departments,
          persons = obj.personPage.items;
        if (departments.length) {
          for (var i = 0; i < departments.length; i++) {
            $ad(configAll.$departList, departItem({id:departments[i].id,name:departments[i].name,type:'department'}));
          };
        };
        if (persons.length) {
          for (var i = 0; i < persons.length; i++) {
            $ad(configAll.$staffList, staffItem({id:persons[i].id,name:persons[i].name,logo:persons[i].logo,headImage:persons[i].headImage,jobs:persons[i].jobs,mobileFir:persons[i].mobileFir,type:'person'}));
          };
        };
        if (!departments.length && !persons.length) {
          $show(configAll.$searchNodata);
          return;
        }
        totalCheck();
        if (obj.personPage.isHasNextPage) {
          configAll.pageSearchIndex = obj.personPage.pageIndex + 1;
          $on(window, 'scroll', staffSearchMore);
        };
      }
    });
  };

  //ajax部门和人员
  function getAjax(departId, pageIndex, personOnly){
    configAll.totalAjaxCount++;
    $off(window, 'scroll', staffAjaxMore);
    $.ajax({
      url: 'http://localhost:3004/list' + departId,
      type: 'GET',
      dataType: 'json',
      data: {
        departId: departId || '',
        pageIndex: pageIndex || 1,
        personOnly: personOnly || false,
        totalAjaxCount: configAll.totalAjaxCount
      },
      /**
       * data = {
       *   "success": true,
       *   "totalAjaxCount": 1  //由前端传回后台，后台再原样返回，为了防止ajax内容再网速慢的情况下加载出错
       *   "obj": {
       *     "departments": [{
       *       "id": 1,
       *       "name": "杭州博科思科技有限公司"
       *     }],
       *     "personPage": {
       *       "pageIndex": 1,
       *       "isHasNextPage": false,
       *       "items":[{
       *         "id": 100001,
       *         "name": "赵一",
       *         "logo": "http://img.51vj.cn/headImg/logo.png",
       *         "headImage": "http://img.51vj.cn/headImg/logo.png",
       *         "jobs": "经理",
       *         "mobileFir": "18758635789"
       *       }]
       *     }
       *   }
       * }
       */
      success: function(data){
        //if(data.totalAjaxCount != configAll.totalAjaxCount) return;  //正式环境请不要注释(除非后台没有返回totalAjaxCount)
        var obj = data.obj,
          departments = obj.departments,
          persons = obj.personPage.items;
        if (departments.length) {
          for (var i = 0; i < departments.length; i++) {
            $ad(configAll.$departList, departItem({id:departments[i].id,name:departments[i].name,type:'department'}));
          };
        };
        if (persons.length) {
          for (var i = 0; i < persons.length; i++) {
            $ad(configAll.$staffList, staffItem({id:persons[i].id,name:persons[i].name,logo:persons[i].logo,headImage:persons[i].headImage,jobs:persons[i].jobs,mobileFir:persons[i].mobileFir,type:'person'}));
          };
        };
        totalCheck();
        if (obj.personPage.isHasNextPage) {
          configAll.departmentId = departId;
          configAll.pageListIndex = obj.personPage.pageIndex + 1;
          $on(window, 'scroll', staffAjaxMore);
        };
      }
    });
  };

  //生成首页Item
  function indexItem(){
    configAll.$input.value = '';
    $off(window, 'scroll', staffSearchMore);
    configAll.departSelected = false; //设置部门选中为false
    delDepartStaff(); //清空部门、人员列表
    $hide(configAll.$searchNodata); //隐藏搜索无结果的样式
    $ad(configAll.$departList, departItem({id: configAll.opts.myDepartmentId,name: '我的部门',type: 'department'}, 'my')); //往部门列表添加我的部门
    /**
     * 获取首页内容
     */
    getAjax(''); ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////todo 删除''
  };//indexItemEnd

  //生成部门Item
  /**
   * data = {
   *   type: 'department',
   *   name: '部门名称',
   *   id: 123456
   * }
   */
  function departItem(data, classNames){
    var $department = configAll.$departItem.cloneNode(),
      $labelCheck = configAll.$checkLabel.cloneNode(),
      $checkBox = configAll.$checkBox.cloneNode(),
      $departDetail = configAll.$departDetail.cloneNode();
    $checkBox.contact = data;
    if (classNames) $departDetail.classList.add(classNames);
    $departDetail.innerHTML = data.name;
    $on($checkBox, 'click', function(){ //checkbox绑定事件
      var checked = this.checked;
      isChecked(checked, data, this);
    });
    $on($departDetail, 'click', function(){ //部门绑定点击事件
      delDepartStaff(); //清空原有的部门、人员列表
      $ad(configAll.$navList, selectNavItem(data)); //往导航栏中添加导航
      configAll.$navList.scrollLeft = 100000;
      configAll.curDepartmentId = data.id; //赋值当前部门id
      departJudge();
      getAjax(data.id); //根据部门id获取当前部门内容
    });
    if (configAll.opts.departEnable == 'off' && data.id != configAll.opts.myDepartmentId) {
      $checkBox.disabled = true;
      $checkBox.classList.add('contact-select-noallow');
    }; //部门不可选的情况
    if (data.id == configAll.opts.myDepartmentId) {
      $checkBox.disabled = true;
      $checkBox.classList.add('contact-select-goto');
    };//我的部门
    $ad($labelCheck, $checkBox);
    $ad($department, $labelCheck);
    $ad($department, $departDetail);
    return $department;
  };//departItemEnd

  //生成人员Item
  /**
   * data = {
   *   type: 'person',
   *   id: 123,
   *   name: '人员名称',
   *   logo: 'http://adadas.png',
   *   headImage: 'http://adadas.png',
   *   jobs: '经理',
   *   mobileFir: 1234567890
   * }
   */
  function staffItem(data){
    var $staff = configAll.$staffItem.cloneNode(),
      $labelCheck = configAll.$checkLabel.cloneNode(),
      $checkBox = configAll.$checkBox.cloneNode(),
      $staffDetail = configAll.$staffDetail.cloneNode();
    $checkBox.contact = data;
    $staffDetail.innerHTML = '<img class="staff-detail-icon" src="'+ (data.logo || data.headImage) +'"><div class="staff-detail-info"><p class="staff-detail-name">'+ data.name +'</p><p class="staff-detail-other"><span class="staff-detail-jobs">'+ (data.jobs || '未知') +'</span><span>'+ (data.mobileFir || '') +'</span></p></div>';
    $on($checkBox, 'click', function(){ //checkbox绑定事件
      var checked = this.checked;
      isChecked(checked, data, this);
    });
    if (configAll.opts.personEnable == 'off') {
      $checkBox.disabled = true;
      $checkBox.classList.add('contact-select-noallow');
    };//人员不可选的情况
    $ad($labelCheck, $checkBox);
    $ad($staff, $labelCheck);
    $ad($staff, $staffDetail);
    return $staff;
  };//departItemEnd

  /**
   * 生成导航栏内容
   */
  function selectNavItem(data){
    var $navItem = configAll.$navItem.cloneNode();
    $navItem.innerHTML = data.name;
    $navItem.id = data.id;
    $navItem.index = $cd(configAll.$navList).length+1;
    $on($navItem, 'click', function(){
      if(this.index == $cd(configAll.$navList).length) return;
      var nextIndex = this.index + 1;
      $rd(configAll.$navList, nextIndex, true);
      delDepartStaff();
      departJudge();
      getAjax(data.id);
    });
    return $navItem;
  };//selectNavItemEnd

  //生成被选部门Item
  function selectDepartItem(data){
    var $selectDepartItem = configAll.$selectDepartItem.cloneNode();
    $selectDepartItem.contact = data;
    $selectDepartItem.innerHTML = data.name;
    $on($selectDepartItem, 'click', function(){
      this.parentNode.removeChild(this);
      unselect(data);
    });
    return $selectDepartItem;
  };//selectDepartItemEnd

  //生成被选人员Item
  function selectStaffItem(data){
    var $selectStaffItem = configAll.$selectStaffItem.cloneNode(),
      html = '<img class="selected-staff-icon" src="'+ (data.logo || data.headImage) +'">';
    if (configAll.opts.personNameShow != 'off') html += '<span class="selected-staff-name">'+ data.name +'</span>';
    $selectStaffItem.contact = data;
    $selectStaffItem.innerHTML = html;
    $on($selectStaffItem, 'click', function(){
      this.parentNode.removeChild(this);
      unselect(data);
    });
    return $selectStaffItem;
  };//selectDepartItemEnd


  //删除部门和人员
  function delDepartStaff(){
    $rd(configAll.$departList);
    $rd(configAll.$staffList);
  };


  //是否为已被选中的部门的子部门
  function departJudge(){
    configAll.departSelected = false;
    var selectedDepart = $cd(configAll.$selectDepartList),
      navItem = $cd(configAll.$navList);
    if (selectedDepart.length){
      for (var i = 0; i < selectedDepart.length; i++) {
        var curData = selectedDepart[i].contact;
        if (navItem.length > 1) {
          for (var j = 1; j < navItem.length; j++) {
            if(navItem[j].id == curData.id){
              configAll.departSelected = true;
              break;
            };
          };
        };
        if (configAll.departSelected) break;
      };
    };
  };

  //父级部门中有被选中的就禁用input
  function disableCheckBox(){
    var checkboxs = configAll.$ctWrap.querySelectorAll('input[type=checkbox]');
    for (var i = 0; i < checkboxs.length; i++) {
      if (checkboxs[i].checked == false) checkboxs[i].disabled = true;
    };
  };

  //勾选选中部门、人员
  function totalCheck(onlyStaff){
    var selectedDepart = $cd(configAll.$selectDepartList),
      selectedStaff = $cd(configAll.$selectStaffList);
    if (selectedDepart.length && !onlyStaff) {
      for (var i = 0; i < selectedDepart.length; i++) {
        var curDataId = selectedDepart[i].contact.id,
          departCheckBox = configAll.$departList.querySelectorAll('input[type=checkbox]');
        for (var j = 0; j < departCheckBox.length; j++) {
          if (departCheckBox[j].contact.id == curDataId) {
            departCheckBox[j].checked = true;
            break;
          };
        };
      };
    };
    if (selectedStaff.length) {
      for (var i = 0; i < selectedStaff.length; i++) {
        var curDataId = selectedStaff[i].contact.id,
          departCheckBox = configAll.$staffList.querySelectorAll('input[type=checkbox]');
        for (var j = 0; j < departCheckBox.length; j++) {
          if (departCheckBox[j].contact.id == curDataId) {
            departCheckBox[j].checked = true;
            break;
          };
        };
      };
    };
    if (configAll.departSelected) disableCheckBox();
  };



  //选择部门和人员
  function isChecked(checked, data, el){
    if (checked) {
      select(data);
    }else{
      unselect(data, el);
    };
  };
  function select(data){
    if (data.type == 'department') {
      $ad(configAll.$selectDepartList, selectDepartItem(data));
    }else if(data.type == 'person') {
      $ad(configAll.$selectStaffList, selectStaffItem(data))
    };
    /**
     * 全局单选//////////////////////////////////////////
     */
    if (configAll.opts.selectType == 'radio'){
      if ($cd(configAll.$selectDepartList).length) {
        var data = $cd(configAll.$selectDepartList)[0].contact;
        $cd(configAll.$selectDepartList)[0].parentNode.removeChild($cd(configAll.$selectDepartList)[0]);
        unselect(data);
      }else if($cd(configAll.$selectStaffList).length) {
        var data = $cd(configAll.$selectStaffList)[0].contact;
        $cd(configAll.$selectStaffList)[0].parentNode.removeChild($cd(configAll.$selectStaffList)[0]);
        unselect(data);
      };
    };
    /**
     * 部门、人员自定义单选多选////////////////////////////////
     */
    if (configAll.opts.selectType == 'off'){
      if (configAll.opts.departSelect == 'radio' && $cd(configAll.$selectDepartList).length > 1) {
        var data = $cd(configAll.$selectDepartList)[0].contact;
        $cd(configAll.$selectDepartList)[0].parentNode.removeChild($cd(configAll.$selectDepartList)[0]);
        unselect(data);
      };
      if (configAll.opts.personSelect == 'radio' && $cd(configAll.$selectStaffList).length > 1) {
        var data = $cd(configAll.$selectStaffList)[0].contact;
        $cd(configAll.$selectStaffList)[0].parentNode.removeChild($cd(configAll.$selectStaffList)[0]);
        unselect(data);
      };
    };

    showSelectText();
  };//selectEnd
  function unselect(data, el){
    if (data.type == 'department') {
      if (el) {
        var childrens = $cd(configAll.$selectDepartList);
      }else{
        departJudge();
        var childrens = configAll.$departList.querySelectorAll('input[type=checkbox]');
        if (configAll.departSelected == false) {
          for (var i = 0; i < childrens.length; i++) {
              childrens[i].disabled = false;
            };
          if (configAll.opts.personEnable != 'off') {
            var checkboxss = configAll.$staffList.querySelectorAll('input[type=checkbox]');
            for (var i = 0; i < checkboxss.length; i++) {
              checkboxss[i].disabled = false;
            };
          };
        };
      };
      for (var i = 0; i < childrens.length; i++) {
        if (childrens[i].contact.id == data.id) {
          if (el) {
            childrens[i].parentNode.removeChild(childrens[i]);
            if (configAll.departSelected) el.disabled = true;
          }else{
            childrens[i].checked = false;
            if (configAll.departSelected) childrens[i].disabled = true;
          };
          break;
        };
      };
    }else if(data.type == 'person') {
      if (el) {
        var childrens = $cd(configAll.$selectStaffList);
      }else{
        var childrens = configAll.$staffList.querySelectorAll('input[type=checkbox]');
      };
      for (var i = 0; i < childrens.length; i++) {
        if (childrens[i].contact.id == data.id) {
          if (el) {
            childrens[i].parentNode.removeChild(childrens[i]);
            if (configAll.departSelected) el.disabled = true;
          }else{
            childrens[i].checked = false;
            if (configAll.departSelected) childrens[i].disabled = true;
          };
          break;
        };
      };
    };
    showSelectText();
  };//selectEnd

  function showSelectText(){
    var selectedDepartLen = $cd(configAll.$selectDepartList).length,
      selectedStaffLen = $cd(configAll.$selectStaffList).length;
    if (selectedDepartLen && selectedStaffLen) {
      configAll.$selectCount.innerHTML = '已选择'+ selectedDepartLen +'个部门，'+ selectedStaffLen +'名成员';
    }else if(selectedDepartLen && !selectedStaffLen){
      configAll.$selectCount.innerHTML = '已选择'+ selectedDepartLen +'个部门';
    }else if(selectedStaffLen && !selectedDepartLen){
      configAll.$selectCount.innerHTML = '已选择'+ selectedStaffLen +'名成员';
    }else{
      configAll.$selectCount.innerHTML = '';
    };
  };

  function navIndexBtn(){
    var $navIndexBtn = configAll.$navIndexBtn.cloneNode(true);
    $navIndexBtn.index = 1;
    $on($navIndexBtn, 'click', function(){
      if(this.index == $cd(configAll.$navList).length) return;
      $rd(configAll.$navList, 2, true);
      indexItem();
    });
    return $navIndexBtn;
  };//navIndexBtnEnd


  //确定按钮
  function mergeContacts(){
    var contact = [],
      staffList = $cd(configAll.$selectStaffList),
      departmentList = $cd(configAll.$selectDepartList);
    for (var i = 0; i < staffList.length; i++) {
      contact.push(staffList[i].contact);
    };
    for (var i = 0; i < departmentList.length; i++) {
      contact.push(departmentList[i].contact);
    };
    configAll.opts.selectEn && configAll.opts.selectEn(contact);
  };//mergeContactsEnd

  //goToTop
  var btnShow = true;
  function showGoTopBtn(){
    if (btnShow && window.scrollY > 600) {
      $show(configAll.$goTopBtn);
      btnShow = false;
    }else if(window.scrollY < 600 && !btnShow){
      $hide(configAll.$goTopBtn);
      btnShow = true;
    };
  };

  //显示通讯录插件
  function showContacts(){
    allowCreactHtml && initContacts(); //初始化

    if (configAll.opts.backBtnShow) {
      $show(configAll.$backBtn);
    }else{
      $hide(configAll.$backBtn);
    };
    configAll.$input.value = '';
    $rd(configAll.$navList);
    $rd(configAll.$selectStaffList);
    $rd(configAll.$selectDepartList);

    $ad(configAll.$navList, navIndexBtn()); //导航栏首页按钮
    indexItem(); //加载首页

    //放入已有的值
    if (configAll.opts.selectSt) {
      var dataObj = configAll.opts.selectSt();
      for (var i = 0; i < dataObj.departList.length; i++) {
        $ad(configAll.$selectDepartList, selectDepartItem(dataObj.departList[i]));
      };
      for (var i = 0; i < dataObj.personList.length; i++) {
        $ad(configAll.$selectStaffList, selectStaffItem(dataObj.personList[i]));
      };
    };
    departJudge();
    totalCheck();
    showSelectText();
    configAll.$selectedBtn.innerHTML = configAll.opts.confirmBtnName;
    $hide(configAll.$ogWrap);
    $show(configAll.$ctWrap);
    $on(window, 'scroll', showGoTopBtn);
  };//showContactsEnd


  //隐藏通讯录
  function hideContacts(){
    $off(window, 'scroll', staffAjaxMore);
    $off(window, 'scroll', staffSearchMore);
    $off(window, 'scroll', showGoTopBtn);
    $hide(configAll.$ctWrap);
    $show(configAll.$ogWrap);
  };//hideContactsEnd


  function initContacts(){
    allowCreactHtml = false;
    var $child = document.body.childNodes,
      cdl = $child.length,
      $form = $c('form'), //搜索
      $navBar = $c('div'), //导航栏
      $footBar = $c('div'), //底部操作栏
      $footSelectMain = $c('div'), //底部选中内容
      $footSelectList = $c('div'); //底部选中列表
    //创建
    configAll.$ogWrap = $c('div'); //原来页面上DOM的包裹层
    configAll.$ctWrap = $c('div'); //通讯录的包裹层

    configAll.$backBtn = $c('a'); //返回按钮
    configAll.$input = $c('input'); //搜索输入框
    configAll.$searchBtn = $c('a'); //搜索按钮

    configAll.$navList = $c('div'); //导航栏
    configAll.$navItem = $c('a'); //导航栏内容
    configAll.$navIndexBtn = $c('a'); //导航首页

    configAll.$departList = $c('ul'); //部门列表
    configAll.$departItem = $c('li'); //部门
    configAll.$checkLabel = $c('label'); // checklabel
    configAll.$checkBox = $c('input'); //checkbox
    configAll.$departDetail = $c('a'); //部门名称
    configAll.$staffList = $c('ul'); //人员列表
    configAll.$staffItem = $c('li'); //人员
    configAll.$staffDetail = $c('div'); //人员详情
    configAll.$searchNodata = $c('p'); //搜索无结果

    configAll.$selectCount = $c('p'); //计数
    configAll.$selectStaffList = $c('ul'); //被选中员工列表
    configAll.$selectStaffItem = $c('li'); //被选中员工内容
    configAll.$selectDepartList = $c('ul'); //被选中部门列表
    configAll.$selectDepartItem = $c('li'); //被选中部门内容
    configAll.$selectedBtn = $c('a'); //确认按钮

    configAll.$goTopBtn = $c('a'); //返回顶部
    //class
    $an(configAll.$ctWrap, 'contact-wrap');
    $an($form, 'contact-search-bar');
    $an(configAll.$backBtn, 'contact-back-btn');
    $an(configAll.$input, 'contact-search-input');
    $an(configAll.$searchBtn, 'contact-search-btn');
    $an($navBar, 'contact-nav-bar');
    $an(configAll.$navList, 'contact-nav-list');
    $an(configAll.$navItem, 'contact-nav-item');
    $an(configAll.$navIndexBtn, 'contact-nav-item');
    $an(configAll.$departList, 'contact-depart-list');
    $an(configAll.$departItem, 'contact-depart-item');
    $an(configAll.$checkLabel, 'contact-select-label');
    $an(configAll.$checkBox, 'contact-select-checkbox');
    $an(configAll.$departDetail, 'contact-depart-detail');

    $an(configAll.$staffList, 'contact-staff-list');
    $an(configAll.$staffItem, 'contact-staff-item');
    $an(configAll.$staffDetail, 'contact-staff-detail');
    $an(configAll.$searchNodata, 'contact-search-nodata');

    $an($footBar, 'contact-foot-bar');
    $an(configAll.$selectCount, 'contact-selected-count');
    $an($footSelectMain, 'contact-selected-main');
    $an($footSelectList, 'contact-selected-list');
    $an(configAll.$selectStaffList, 'contact-selected-staff');
    $an(configAll.$selectStaffItem, 'selected-staff-item');
    $an(configAll.$selectDepartList, 'contact-selected-depart');
    $an(configAll.$selectDepartItem, 'selected-depart-item');
    $an(configAll.$selectedBtn, 'contact-confirm-btn');
    $an(configAll.$goTopBtn, 'contact-gotop-btn');
    //setAttribute
    $sab(configAll.$input, 'type', 'search');
    $sab(configAll.$input, 'placeholder', '搜索名字/拼音/手机号码/职位');
    configAll.$navIndexBtn.innerHTML = '首页';
    $sab(configAll.$checkBox, 'type', 'checkbox');
    configAll.$searchNodata.innerHTML = '没有搜索结果<br>您可以换一个关键词试试';
    //fn
    //返回
    $on(configAll.$backBtn, 'click', function(){
      hideContacts();
    });
    //搜索回车
    $on(configAll.$input, 'keydown', function(e){
      if(e.keyCode == 13){
        e.preventDefault();
        searchContacts();
      };
    });
    //搜索按钮
    $on(configAll.$searchBtn, 'click', function(){
      searchContacts();
    });
    //点击确认按钮触发事件
    $on(configAll.$selectedBtn, 'click', function(){
      mergeContacts();
      hideContacts();
    });
    //返回顶部
    $on(configAll.$goTopBtn, 'click', function(){
      document.body.scrollTop = 0;
    });


    //append
    $ad($form, configAll.$backBtn); //返回按钮
    $ad($form, configAll.$input); //搜索输入框
    $ad($form, configAll.$searchBtn); //搜索按钮
    $ad($navBar, configAll.$navList); //导航栏列表

    $ad($footBar, configAll.$selectCount); //底部计数栏
    $ad($footSelectList, configAll.$selectStaffList); //被选中员工列表
    $ad($footSelectList, configAll.$selectDepartList); //被选中部门列表
    $ad($footSelectMain, $footSelectList); //选中列表
    $ad($footSelectMain, configAll.$selectedBtn); //确定按钮
    $ad($footBar, $footSelectMain); //底部内容

    $ad(configAll.$ctWrap, $form); //搜索
    $ad(configAll.$ctWrap, $navBar); //导航栏
    $ad(configAll.$ctWrap, configAll.$departList) //部门列表
    $ad(configAll.$ctWrap, configAll.$staffList) //部门列表
    $ad(configAll.$ctWrap, configAll.$searchNodata) //无搜索结果
    $ad(configAll.$ctWrap, $footBar); //底部操作栏

    $ad(configAll.$ctWrap, configAll.$goTopBtn); //返回顶部按钮


    /*var labelA = configAll.$ctWrap.querySelectorAll('a');
    for (var i = 0; i < labelA.length; i++) {
      $sab(labelA[i], 'href', 'javascript:void(0)');
    };*/

    $ad(document.body, configAll.$ogWrap);
    for (var i = 0; i < cdl; i++) {
      $ad(configAll.$ogWrap, $child[0]);
    };
    $ad(document.body, configAll.$ctWrap);
  };//initContactsEnd

})(window);