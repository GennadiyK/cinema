var assert = function (value, desc) {
    var li = document.createElement('li');
    li.className = value ? 'pass' : 'fail';
    li.appendChild(document.createTextNode(desc));
    document.getElementById('test-result').appendChild(li);
};
