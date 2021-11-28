var socket = io.connect(window.location.hostname, { 'forceNew': true });

socket.on('result', function(data) {
    document.getElementById("result").value = data.result;
});

function validate_and_send() {
    var form = {};
    form.method = parseInt(document.getElementById("method").value);
    form.n = parseInt(document.getElementById("n").value);
    form.formula = document.getElementById("formula").value /*.substring(8)*/ || "sin(PI * x) * (e ^ x - 1)";
    form.left = document.getElementById("left").value;
    form.right = document.getElementById("right").value;

    socket.emit('calculate', form);
}