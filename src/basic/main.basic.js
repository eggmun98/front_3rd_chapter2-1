const dom = {
  $sel: null,
  $addBtn: null,
  $cartDisp: null,
  $sum: null,
  $stockInfo: null,
  $root: null,
  $cont: null,
  $wrap: null,
  $hTxt: null,
};

let { $sel, $addBtn, $cartDisp, $sum, $stockInfo, $root, $cont, $wrap, $hTxt } = dom;

const state = {
  prodList: [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ],
  lastSel: null,
  bonusPts: 0,
  totalAmt: 0,
  itemCnt: 0,
};
let { prodList, lastSel, bonusPts, totalAmt, itemCnt } = state;

function createItemHTML(item) {
  return `
      <span>${item.name} - ${item.val}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button>
      </div>
    `;
}

function main() {
  $root = document.getElementById('app');
  $cont = document.createElement('div');
  $wrap = document.createElement('div');
  $hTxt = document.createElement('h1');

  $cartDisp = document.createElement('div');
  $sum = document.createElement('div');
  $sel = document.createElement('select');
  $addBtn = document.createElement('button');

  $stockInfo = document.createElement('div');

  $cartDisp.id = 'cart-items';
  $sum.id = 'cart-total';
  $sel.id = 'product-select';
  $addBtn.id = 'add-to-cart';

  $stockInfo.id = 'stock-status';
  $cont.className = 'bg-gray-100 p-8';
  $wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $hTxt.className = 'text-2xl font-bold mb-4';
  $sum.className = 'text-xl font-bold my-4';
  $sel.className = 'border rounded p-2 mr-2';
  $addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockInfo.className = 'text-sm text-gray-500 mt-2';

  $hTxt.textContent = '장바구니';
  $addBtn.textContent = '추가';

  updateSelOpts();

  $wrap.appendChild($hTxt);
  $wrap.appendChild($cartDisp);
  $wrap.appendChild($sum);
  $wrap.appendChild($sel);
  $wrap.appendChild($addBtn);
  $wrap.appendChild($stockInfo);
  $cont.appendChild($wrap);
  $root.appendChild($cont);

  calcCart();

  setTimeout(function () {
    setInterval(function () {
      let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelOpts() {
  $sel.innerHTML = '';
  prodList.forEach(function (item) {
    let $opt = document.createElement('option');
    $opt.value = item.id;

    $opt.textContent = item.name + ' - ' + item.val + '원';
    if (item.q === 0) $opt.disabled = true;
    $sel.appendChild($opt);
  });
}

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  let cartItems = $cartDisp.children;
  let subTot = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      let q = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      let itemTot = curItem.val * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    let bulkDisc = totalAmt * 0.25;
    let itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  $sum.textContent = '총액: ' + Math.round(totalAmt) + '원';
  if (discRate > 0) {
    let span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    $sum.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPts += Math.floor(totalAmt / 1000);
  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    $sum.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

function updateStockInfo() {
  let infoMsg = '';
  prodList.forEach(function (item) {
    if (item.q < 5) {
      infoMsg += item.name + ': ' + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') + '\n';
    }
  });
  $stockInfo.textContent = infoMsg;
}
main();

$addBtn.addEventListener('click', function () {
  let selItem = $sel.value;
  let itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      let $newItem = document.createElement('div');
      $newItem.id = itemToAdd.id;
      $newItem.className = 'flex justify-between items-center mb-2';
      $newItem.innerHTML = createItemHTML(itemToAdd);
      $cartDisp.appendChild($newItem);
      itemToAdd.q--;
    }
    calcCart();
    lastSel = selItem;
  }
});

$cartDisp.addEventListener('click', function (event) {
  let tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (newQty > 0 && newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
