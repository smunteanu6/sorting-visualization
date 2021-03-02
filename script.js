const DOM = {
  container: document.getElementById('container'),
  elements_count: document.getElementById('elements_count'),
  count_indicator: document.getElementById('count_indicator'),
  sorting_algorithm: document.getElementById('sorting_algorithm'),
  sort: document.getElementById('sort'),
  shuffle: document.getElementById('shuffle')
}

const data = {
  elements_count: parseInt(DOM.elements_count.value),
  time_interval: undefined,
  array: new Array()
}

const determine_time_interval = () => {
  if (data.elements_count < 30) data.time_interval = 100;
  else if (data.elements_count < 100) data.time_interval = 10;
  else if (data.elements_count < 1000) data.time_interval = 0;
}

determine_time_interval();

const initialization = (() => {
  const max = parseInt(DOM.elements_count.max)+1;
  DOM.count_indicator.textContent = DOM.elements_count.value;

  for (let i = 0; i < max; i++) {
    const child = document.createElement('DIV');
    data.array.push(Math.random() * 2000);
    child.style.height = 100 / 2000 * data.array[i] + '%';
    DOM.container.appendChild(child);
  } 

  for (let i = data.elements_count; i < max; i++) {
    DOM.container.childNodes[i].style.display = 'none';
  }
})();

const size_adjusting = (() => {
  const set_count = count => {
    if (count < data.elements_count)
      for (let i = data.elements_count - 1; i >= count; i--)
        DOM.container.childNodes[i].style.display = 'none';
    else for (let i = data.elements_count; i < count; i++)
      DOM.container.childNodes[i].style.display = 'block';
    data.elements_count = count;
    determine_time_interval();
  }
  
  DOM.elements_count.addEventListener('input', () => {
    DOM.count_indicator.textContent = DOM.elements_count.value;
    set_count(parseInt(DOM.elements_count.value));
  });
})();

Array.prototype.swap = function (a, b) {
  let m = this[a];
  this[a] = this[b];
  this[b] = m;
  let n = DOM.container.childNodes[a].style.height;
  DOM.container.childNodes[a].style.height = DOM.container.childNodes[b].style.height;
  DOM.container.childNodes[b].style.height = n;
}

const quicksort = async mode => {
  const partition = async (begin, end) => {
    let pivot = data.array[end], i = begin - 1;
    for (let j = begin; j < end; j++)
      await new Promise(res => {
        if (data.array[j] < pivot) data.array.swap(j, ++i);
        setTimeout(res, data.time_interval);
      });
    data.array.swap(++i, end);
    return i;
  }
  
  const quicksort_nrm = async (begin, end) => {
    if (begin < end) {
      let pivot = await partition(begin, end);
      await quicksort_nrm(begin, pivot - 1);
      await quicksort_nrm(pivot + 1, end);
    }
  }

  const quicksort_alt = async (begin, end) => {
    if (begin < end) {
      let pivot = await partition(begin, end);
      quicksort_alt(begin, pivot - 1);
      quicksort_alt(pivot + 1, end);
    }
  }

  mode == 'alt' ? quicksort_alt(0, data.elements_count) : quicksort_nrm(0, data.elements_count);
}

const bubble_sort = async () => {
  let n = data.elements_count;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (data.array[j] > data.array[j+1])
        await new Promise(res => {
          data.array.swap(j, j+1), swapped = true;
          setTimeout(res, data.time_interval / 10);
        });
    }
    if (!swapped) break;
  }
}

const merge_sort = async () => {
  const merge = async (l, m, r) => {
    let n1 = m - l + 1, n2 = r - m;
    let L = new Array(n1), R = new Array(n2), Lh = new Array(n1), Rh = new Array(n2);
    for (let i = 0; i < n1; i++)
      L[i] = data.array[l+i],
      Lh[i] = DOM.container.childNodes[l+i].style.height;
    for (let j = 0; j < n2; j++)
      R[j] = data.array[m+1+j],
      Rh[j] = DOM.container.childNodes[m+1+j].style.height;
    let i=0, j=0, k=l;
    while (i < n1 && j < n2) {
      await new Promise(res => {
        if (L[i] <= R[j]) {
          data.array[k] = L[i];
          DOM.container.childNodes[k++].style.height = Lh[i++];
          setTimeout(res, data.time_interval);
        } else {
          data.array[k] = R[j];
          DOM.container.childNodes[k++].style.height = Rh[j++];
          setTimeout(res, data.time_interval);
        }
      })
    }
    while (i < n1) {
      await new Promise(res => {
        DOM.container.childNodes[k].style.height = Lh[i];
        data.array[k++] = L[i++];
        setTimeout(res, data.time_interval);
      })
    }
    while (j < n2) {
      await new Promise(res => {
        DOM.container.childNodes[k].style.height = Rh[j];
        data.array[k++] = R[j++];
        setTimeout(res, data.time_interval);
      })
    }
  }

  const sort = async (l, r) => {
    if (l < r) {
      let m = Math.floor((r + l) / 2);
      await sort(l, m);
      await sort(m+1, r);
      await merge(l, m, r);
    }
  }

  sort(0, data.elements_count);
}

DOM.sort.addEventListener('click', () => {
  switch (DOM.sorting_algorithm.value) {
    case 'quicksort_nrm': quicksort('nrm'); break;
    case 'quicksort_alt': quicksort('alt'); break;
    case 'bubble_sort': bubble_sort(); break;
    case 'merge_sort': merge_sort(); break;
  }
});

DOM.shuffle.addEventListener('click', () => {
  for (let i = 0; i < data.array.length; i++)
    data.array.swap(i, Math.floor(Math.random() * data.array.length));
});