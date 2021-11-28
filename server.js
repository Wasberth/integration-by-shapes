const express = require('express');
const evaluatex = require('evaluatex');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', function(socket) {
    console.log('Alguien se ha conectado');

    function calculateMiddlePoint(form) {
        var result = 0;

        try {
            const func = evaluatex(form.formula);
            const left = evaluatex(form.left)();
            const right = evaluatex(form.right)();

            const deltaX = evaluatex("(b - a) / n")({ b: right, a: left, n: form.n });
            const middlePoint = evaluatex("(1 / 2) (x + f(x))", { f: function(x) { return x + deltaX; } });

            for (let x = left + deltaX; x <= right; x += deltaX) {
                var mx = middlePoint({ x: x });
                result += func({ x: mx });
            }

            result *= deltaX;

        } catch (error) {
            console.log(error);
            console.log('Murió');
            socket.emit('result', { result: 0 });
            return;
        }
        socket.emit('result', { result: result });
    }

    function calculateTrapeze(form) {
        var result = 0;

        try {
            const formula = evaluatex(form.formula);
            const left = evaluatex(form.left)();
            const right = evaluatex(form.right)();

            const deltaX = evaluatex("(b - a) / n")({ b: right, a: left, n: form.n });

            result = formula({ x: left }) + formula({ x: right });

            for (let i = 1; i < form.n - 1; i++) {
                result += 2 * formula({ x: left + (i * deltaX) });
            }

            result *= deltaX / 2;

        } catch (error) {
            console.log(error);
            console.log('Murió');
            socket.emit('result', { result: 0 });
            return;
        }
        socket.emit('result', { result: result });
    }

    function calculateSimpson(form) {
        if (form.n % 2 != 0) {
            socket.emit('result', { result: 0 });
            return;
        }

        var result = 0;

        try {
            const formula = evaluatex(form.formula);
            const left = evaluatex(form.left)();
            const right = evaluatex(form.right)();

            const deltaX = evaluatex("(b - a) / n")({ b: right, a: left, n: form.n });

            result = formula({ x: left }) + formula({ x: right });

            for (let i = 1; i < form.n - 1; i++) {
                factor = 2 * ((i % 2) + 1)
                result += factor * formula({ x: left + (i * deltaX) });
            }

            result *= deltaX / 3;

        } catch (error) {
            console.log(error);
            console.log('Murió');
            socket.emit('result', { result: 0 });
            return;
        }

        socket.emit('result', { result: result });
    }

    socket.on('calculate', function(form) {
        if (!Number.isInteger(form.method) || !Number.isInteger(form.n) ||
            typeof form.formula === 'undefined' || typeof form.left === 'undefined' ||
            typeof form.right === 'undefined') {
            console.log("owo");
            return;
        }

        if (form.n < 0 || form.n > 500) {
            console.log("awa");
            return;
        }

        try {

        } catch (error) {
            return;
        }

        console.log("DATA ARRIVED!");
        console.log(form);

        switch (form.method) {
            case 1:
                calculateMiddlePoint(form);
                break;
            case 2:
                calculateTrapeze(form);
                break;
            case 3:
                calculateSimpson(form);
                break;
        }
    });
});

server.listen(port, function() {
    console.log(evaluatex);
    console.log(`Servidor corriendo en el puerto ${port}`);
});