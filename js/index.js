(()=>{
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    function toDOM(HTMLstring){
        var d = document.createElement('div');
        d.innerHTML = HTMLstring;
        var docFrag = document.createDocumentFragment();
        while (d.firstChild) {
            docFrag.appendChild(d.firstChild)
        };
        return docFrag;
    }
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    let onSubmit,onShow;
    document.querySelector("form").addEventListener("submit", (evt)=>{
        evt.preventDefault();
        document.querySelector("input[type=submit]").disabled = true;
        let ans = document.querySelector('input[name="variant"]:checked').value;
        //console.log(ans);
        onSubmit(ans)

        document.querySelector(".box").classList.toggle("show");
        setTimeout(()=>{
            onShow()
            document.querySelector(".box").classList.toggle("show");
            document.querySelector("input[type=submit]").disabled = false;
        },500);
    });

    let iframe = document.createElement("script");
    iframe.src = "./js/variant.txt";
    iframe.onload = (e)=>{
        let qn = 0;
        let testData = window.testData();
        testData = testData.split("\n")
        let ask = false;
        let testDataArr = []
        let ans = []
        for(let i in testData) {
            if (!ask && testData[i] == '') continue;
            if (!ask) {
                ask = testData[i];
                continue;
            }
            if (testData[i] == '') {
                testDataArr.push({ask,ans});
                ask = '';
                ans = [];
                continue;
            }
            ans.push(testData[i])
        }
        shuffle(testDataArr)
        let question = document.querySelector(".question");
        let loadQn = (i)=> {
            question.innerText = testDataArr[i].ask;
            let arrKeys = Object.keys(testDataArr[i].ans);
            shuffle(arrKeys)
            testDataArr[i].arrKeys = arrKeys;
            for(let k in arrKeys) {
                let k2 = arrKeys[k]
                let html = `<div class="variant">
                    <label><input type="radio" name="variant" value="${k}" required>${testDataArr[i].ans[k2]}</label>
                 </div>`
                let el = toDOM(html);
                insertAfter(el,question)
            }
        }
        let ansLog = [];
        onSubmit = (k) => {
            let xk = testDataArr[qn].arrKeys[k];
            let suc = false;
            if (xk == testDataArr[qn].arrKeys.length-1) suc = true;
            ansLog[qn] = suc;
            qn++
            onShow = () => {
                let v = document.querySelectorAll('.variant');
                for(let i = 0; i< v.length; i++) {
                    v[i].parentNode.removeChild(v[i]);
                }
                if (testDataArr.length > qn) loadQn(qn);
                else {                    
                    let c = 0;
                    for(let i in ansLog) {
                        if (ansLog[i]) c++;
                        let html = `<div class="variant">
                            <label>${testDataArr[i].ask}</label>
                            <label>${(ansLog[i])?"Так":"Ні"}</label>
                         </div><br>`
                        let el = toDOM(html);
                        insertAfter(el,question)
                    }
                    question.innerText = `Результат: правильно ${c} з ${ansLog.length}(${Math.round(100/ansLog.length*c)}%)`
                    document.querySelector('input').style = 'display: none;'
                }
            }
        }
        loadQn(qn);
        
        //console.log(e);
        document.body.removeChild(iframe);
    }
    this.onload = (e)=>{
        //console.log(e);
        //let x = window.testData();
        document.body.removeChild(document.body.children[document.body.children.length-1]);
        document.body.appendChild(iframe);
    }
    //document.body.appendChild(iframe);
})()

