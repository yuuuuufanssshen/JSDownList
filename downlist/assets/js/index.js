(function (window,document) {
    let showSelection = true;
    //step1：给下拉菜单元素分类显示
    //step2： 点击别的地方消失
    //step3：hover和选定后的样式
    //**step4：搜索方法：输入值，匹配数列中的option并只显示这个
    //step5：改变<p></p>
    //公共方法集合

    const methods = {
        appendChild(parent, ...children) {
            children.forEach(el => {
                parent.appendChild(el);
            });
        },
        $(selector, root = document) {
            return root.querySelector(selector);
        },
        $$(selector, root = document) {
            return root.querySelectorAll(selector);
        }
    };

    let DownList = function(options){
        this._init(options);
        this._creatTemplet();
        this._bind();
        this._show();

    }

    //初始化
    DownList.prototype._init = function ({data,parasitifer}) {
        this.types=[];
        this.all = []; // 所有选项
        this.outputP = null;
        this.parasitifer = methods.$(parasitifer); // 挂载点
        this.classified = {'':[]}; // 按照类型分类后的选项
        this.wrap = null;
        this.selectContainer = null;
        this._classify(data);
    };

    DownList.prototype._classify = function (data) {
    //options 放值
    //classified 放index和type
        let options = [];
        data.forEach(({type,option}) => {
            if(!this.types.includes(type)){
                this.types.push(type);

            }

            if (!Object.keys(this.classified).includes(type)) {
                this.classified[type] = [];
            }

            if (!options.includes(option)){
                //选项没有加入分类
                //得到选项并加入分类
                options.push(option);
                let li = `<li class="option_value">${option}</li>`;

                this.all.push(li);

                this.classified[type].push(this.all.length - 1);
            }else{
                this.classified[type].push(options.findIndex(s1 => s1 === option));
            }
        })
    };
    //根据type拿到option
    DownList.prototype._getImgsByType = function(type) {
        return type === '' ? [...this.all] : this.classified[type].map(index => this.all[index]);
    };
    //生成整体模版
    DownList.prototype._creatTemplet = function () {
        let typesValue = [];

        for (let type of this.types.values()){
            typesValue.push(`<li class="option_type">${type}</li>`);
            typesValue.push(this._getImgsByType(type).join(''));
        }

        let template = `
        <div class="viewBox">
        <input type="text" class="viewInput" value="未选择" readonly="readonly">
        <div class="btnImg"><img src="./assets/image/xiala.png" alt=""></div>
        </div>
        <ul class="optionBox">
        <li class="searchbox" ><input class = "search"type="text" placeholder="搜索"></li>
        ${typesValue.join('')}
        </ul>`;
        let outputP = document.createElement('div');
        outputP.innerHTML = '<p class="out"></p>';
        this.outputP = outputP;
        let wrap = document.createElement('div');
        wrap.innerHTML = template;
        this.wrap = wrap;
        methods.appendChild(this.wrap, outputP);
    };
    //绑定点击事件
    DownList.prototype._bind = function(){
        //*****可以将显示和消失的代码提炼出来******
        let optionBox = methods.$('.optionBox',this.wrap);
        let viewInput = methods.$('.viewInput',this.wrap);
        let searchInput = methods.$('.search',this.wrap);
        //给下拉菜单绑定点击事件
        methods.$('.viewBox', this.wrap).addEventListener('click', () => {
            //选出需要改变的项；
            if (showSelection){
            setTimeout(() => {
                optionBox.style.transform = 'scale(1, 1) translate(0, 0)';
                optionBox.style.opacity = '1';
                showSelection = false;
            });
            }else{
                optionBox.style.opacity = '0';
                optionBox.style.transform = 'scale(1, 0)';
                showSelection = true;
            }
        });
        //给选项绑定点击事件;
        let values = methods.$$('.option_value',this.wrap);
        optionBox.addEventListener('click',({ target })=>{
            if (target.className === 'option_value'){
                for(var i = 0; i < values.length;i++){
                    values[i].style.backgroundColor = 'white';
                    values[i].style.color = 'black';
                }
                viewInput.value = target.innerHTML;
                target.style.backgroundColor = 'blue';
                target.style.color = 'white';
                optionBox.style.opacity = '0';
                optionBox.style.transform = 'scale(1, 0)';
                showSelection = true;
            }
        });
        //搜索框添加输入监听
        searchInput.addEventListener('keyup',()=>{
            for(var i = 0; i < values.length;i++){
                if (!(values[i].innerHTML.toLowerCase().includes(searchInput.value.toLowerCase())))
                    values[i].style.display = 'none';
                else{
                    values[i].style.display = 'block';
                }
            }
        });


    };
    

    //显示下拉框
    DownList.prototype._show = function() {
        methods.appendChild(this.parasitifer, this.wrap);
    };

    window.$DownList = DownList;

})(window,document);