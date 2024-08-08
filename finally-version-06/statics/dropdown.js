document.addEventListener('DOMContentLoaded', function() {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownListContainer = document.querySelector('.dropdown-list-container');
    const dropdownArrow = document.querySelector('.dropdown-arrow img');
    const dropdownList = document.querySelector('.dropdown-list');
    const dropdownTitle = document.querySelector('.dropdown-title');

    dropdownListContainer.style.display = 'none';

    dropdownButton.addEventListener('click', function() {
        dropdownListContainer.style.display = dropdownListContainer.style.display === 'none' ? 'block' : 'none';
        dropdownArrow.classList.toggle('rotated');
    });

    function addDropdownItem(itemText, iconPath, index) {
        const listItem = document.createElement('li');
        const icon = document.createElement('img');
        icon.src = iconPath; // 设置图标的路径
        icon.classList.add('dropdown-item-icon'); // 添加图标样式类
        listItem.appendChild(icon);
        const text = document.createTextNode(itemText);
        listItem.appendChild(text);
        listItem.setAttribute('data-index', index); // 添加一个数据属性来存储索引
        dropdownList.appendChild(listItem);
    }

    // 示例：添加一些列表项和对应的图标路径
    addDropdownItem('在家做饭', '../resource/image/eatin.svg', 0);
    addDropdownItem('在外吃饭', '../resource/image/eatout.svg', 2);
    addDropdownItem('营养成分查询', '../resource/image/nutrition.svg', 5);

    // 点击下拉列表项时，更新标题、勾选图标，并关闭下拉列表
    dropdownList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            dropdownTitle.textContent = event.target.textContent;
            document.querySelectorAll('.dropdown-list li.selected').forEach(function(item) {
                item.classList.remove('selected');
            });
            event.target.classList.add('selected');
            dropdownListContainer.style.display = 'none';
            dropdownArrow.classList.remove('rotated'); // 当选择一个选项后，恢复箭头初始状态
            // 获取列表项的索引
            const index = event.target.getAttribute('data-index');
            const selectedIcon = event.target.querySelector('.dropdown-item-icon');
            dropdownButton.querySelector('.dropdown-icon img').src = selectedIcon.src;
            // 传递模型编号给chooseModelDish函数
            chooseModelDish(index);
        }
    });

    document.addEventListener('click', function(event) {
        if (!dropdownButton.contains(event.target)) {
            dropdownListContainer.style.display = 'none';
            dropdownArrow.classList.remove('rotated'); // 点击外部时，恢复箭头初始状态
        }
    });
});


