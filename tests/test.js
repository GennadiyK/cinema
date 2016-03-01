function assert(value, desc) {
    var li = document.createElement('li');
    li.className = value ? 'pass' : 'fail';
    li.appendChild(document.createTextNode(desc));
    document.getElementById('result').appendChild(li);
}




window.onload = function() {
    assert(true, 'true, a NOT equally b');
    assert(false, 'Fail, a equally b!');
    console.log(cinema);


};