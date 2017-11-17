/**
 *
 */
// import {plugIn} from 'plugIn.js'; import {highLight} from 'highLight.js';
// notice.html 字数统计
let textNumber = {
  number: 0,
  listener: (t, callback) => {
    t.oninput = () => {
      textNumber.number = t.value.length;
      callback()
    }
  },
  show: (t) => {
    t.textContent = `${textNumber.number}/`
  },
  init: (wrap) => {
    textNumber.listener(wrap.listenerNode, () => textNumber.show(wrap.showNode))
  }
};
//
let showMoreChoose = {
  controller: (t,r,callback) => {
    t.onchange = () => {
      if (t.checked) {
        callback(true);
        showMoreChoose.target(r, false)
      } else {
        callback(false)
      }
    }
  },
  target: (t, boolean) => {
    t.length > 1
      ? Array
        .from(t)
        .forEach(function (ele) {
          boolean
            ? ele.style.display = 'block'
            : ele.style.display = 'none'
        })
      : boolean
        ? t.style.display = 'block'
        : t.style.display = 'none'
  },
  init: (wrap) => {
    showMoreChoose.controller(wrap.controllerNode, wrap.removeNode, (boolean) => showMoreChoose.target(wrap.targetNode, boolean))
  }
}

window.onload = () => {
  textNumber.init({
    listenerNode: document.getElementById('input1'),
    showNode: document.getElementById('input1-number')
  })
  showMoreChoose.init({
    controllerNode: document.getElementById('show-more'),
    removeNode: document.getElementById('show-more-wrap'),
    targetNode: document.getElementsByClassName('more-choose')
  })
}
