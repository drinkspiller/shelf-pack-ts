'use strict';

var test = require('tap').test;
var ShelfPack = require('../.');

test('ShelfPack', function(t) {
    t.test('batch pack allocates same height bins on existing shelf', function(t) {
        var sprite = new ShelfPack(64, 64),
            bins = [
                { id: 'a', width: 10, height: 10 },
                { id: 'b', width: 10, height: 10 },
                { id: 'c', width: 10, height: 10 }
            ],
            expectedResults = [
                { x: 0,  y: 0, w: 10, h: 10, width: 10, height: 10 },
                { x: 10, y: 0, w: 10, h: 10, width: 10, height: 10 },
                { x: 20, y: 0, w: 10, h: 10, width: 10, height: 10 }
            ];

        var results = sprite.pack(bins);
        t.deepEqual(results, expectedResults);
        t.end();
    });

    t.test('batch pack allocates larger bins on new shelf', function(t) {
        var sprite = new ShelfPack(64, 64),
            bins = [
                { id: 'a', width: 10, height: 10 },
                { id: 'b', width: 10, height: 15 },
                { id: 'c', width: 10, height: 20 }
            ],
            expectedResults = [
                { x: 0, y: 0,  w: 10, h: 10, width: 10, height: 10 },
                { x: 0, y: 10, w: 10, h: 15, width: 10, height: 15 },
                { x: 0, y: 25, w: 10, h: 20, width: 10, height: 20 }
            ];

        var results = sprite.pack(bins);
        t.deepEqual(results, expectedResults);
        t.end();
    });

    t.test('batch pack allocates shorter bins on existing shelf, minimizing waste', function(t) {
        var sprite = new ShelfPack(64, 64),
            bins = [
                { id: 'a', width: 10, height: 10 },
                { id: 'b', width: 10, height: 15 },
                { id: 'c', width: 10, height: 20 },
                { id: 'd', width: 10, height: 9  }
            ],
            expectedResults = [
                { x: 0,  y: 0,  w: 10, h: 10, width: 10, height: 10 },
                { x: 0,  y: 10, w: 10, h: 15, width: 10, height: 15 },
                { x: 0,  y: 25, w: 10, h: 20, width: 10, height: 20 },
                { x: 10, y: 0,  w: 10, h: 9,  width: 10, height: 9  }
            ];

        var results = sprite.pack(bins);
        t.deepEqual(results, expectedResults);
        t.end();
    });

    t.test('batch pack accepts `w`, `h` for `width`, `height`', function(t) {
        var sprite = new ShelfPack(64, 64),
            bins = [
                { id: 'a', w: 10, h: 10 },
                { id: 'b', w: 10, h: 10 },
                { id: 'c', w: 10, h: 10 }
            ],
            expectedResults = [
                { x: 0,  y: 0, w: 10, h: 10, width: 10, height: 10 },
                { x: 10, y: 0, w: 10, h: 10, width: 10, height: 10 },
                { x: 20, y: 0, w: 10, h: 10, width: 10, height: 10 }
            ];

        var results = sprite.pack(bins);
        t.deepEqual(results, expectedResults);
        t.end();
    });

    t.test('batch pack adds `x`, `y` properties to bins with `inPlace` option', function(t) {
        var sprite = new ShelfPack(64, 64),
            bins = [
                { id: 'a', w: 10, h: 10 },
                { id: 'b', w: 10, h: 10 },
                { id: 'c', w: 10, h: 10 }
            ],
            expectedResults = [
                { x: 0,  y: 0, w: 10, h: 10, width: 10, height: 10 },
                { x: 10, y: 0, w: 10, h: 10, width: 10, height: 10 },
                { x: 20, y: 0, w: 10, h: 10, width: 10, height: 10 }
            ],
            expectedBins = [
                { id: 'a', w: 10, h: 10, x: 0,  y: 0 },
                { id: 'b', w: 10, h: 10, x: 10, y: 0 },
                { id: 'c', w: 10, h: 10, x: 20, y: 0 }
            ];

        var results = sprite.pack(bins, { inPlace: true });
        t.deepEqual(results, expectedResults);
        t.deepEqual(bins, expectedBins);
        t.end();
    });

    t.test('batch pack skips bins if not enough room', function(t) {
        var sprite = new ShelfPack(20, 20),
            bins = [
                { id: 'a', w: 10, h: 10 },
                { id: 'b', w: 10, h: 10 },
                { id: 'c', w: 10, h: 30 },  // should skip
                { id: 'd', w: 10, h: 10 }
            ],
            expectedResults = [
                { x: 0,  y: 0,  w: 10, h: 10, width: 10, height: 10 },
                { x: 10, y: 0,  w: 10, h: 10, width: 10, height: 10 },
                { x: 0,  y: 10, w: 10, h: 10, width: 10, height: 10 }
            ],
            expectedBins = [
                { id: 'a', w: 10, h: 10, x: 0,  y: 0 },
                { id: 'b', w: 10, h: 10, x: 10, y: 0 },
                { id: 'c', w: 10, h: 30 },
                { id: 'd', w: 10, h: 10, x: 0, y: 10 }
            ];

        var results = sprite.pack(bins, { inPlace: true });
        t.deepEqual(results, expectedResults);
        t.deepEqual(bins, expectedBins);
        t.end();
    });

    t.test('single allocates same height bins on existing shelf', function(t) {
        var sprite = new ShelfPack(64, 64);
        t.deepEqual(sprite.allocate(10, 10), { x: 0,  y: 0, w: 10, h: 10, width: 10, height: 10 }, 'first 10x10 bin');
        t.deepEqual(sprite.allocate(10, 10), { x: 10, y: 0, w: 10, h: 10, width: 10, height: 10 }, 'second 10x10 bin');
        t.deepEqual(sprite.allocate(10, 10), { x: 20, y: 0, w: 10, h: 10, width: 10, height: 10 }, 'third 10x10 bin');
        t.end();
    });

    t.test('single allocates larger bins on new shelf', function(t) {
        var sprite = new ShelfPack(64, 64);
        t.deepEqual(sprite.allocate(10, 10), { x: 0, y: 0,  w: 10, h: 10, width: 10, height: 10 }, 'shelf 1, 10x10 bin');
        t.deepEqual(sprite.allocate(10, 15), { x: 0, y: 10, w: 10, h: 15, width: 10, height: 15 }, 'shelf 2, 10x15 bin');
        t.deepEqual(sprite.allocate(10, 20), { x: 0, y: 25, w: 10, h: 20, width: 10, height: 20 }, 'shelf 3, 10x20 bin');
        t.end();
    });

    t.test('single allocates shorter bins on existing shelf, minimizing waste', function(t) {
        var sprite = new ShelfPack(64, 64);
        t.deepEqual(sprite.allocate(10, 10), { x: 0,  y: 0,  w: 10, h: 10, width: 10, height: 10 }, 'shelf 1, 10x10 bin');
        t.deepEqual(sprite.allocate(10, 15), { x: 0,  y: 10, w: 10, h: 15, width: 10, height: 15 }, 'shelf 2, 10x15 bin');
        t.deepEqual(sprite.allocate(10, 20), { x: 0,  y: 25, w: 10, h: 20, width: 10, height: 20 }, 'shelf 3, 10x20 bin');
        t.deepEqual(sprite.allocate(10, 9),  { x: 10, y: 0,  w: 10, h: 9,  width: 10, height: 9  }, 'shelf 1, 10x9 bin');
        t.end();
    });

    t.test('not enough room', function(t) {
        var sprite = new ShelfPack(10, 10);
        t.deepEqual(sprite.allocate(10, 10), { x: 0, y: 0, w: 10, h: 10, width: 10, height: 10 }, 'first 10x10 bin');
        t.notOk(sprite.allocate(10, 10), 'not enough room');
        t.end();
    });

    t.test('clear succeeds', function(t) {
        var sprite = new ShelfPack(10, 10);
        t.deepEqual(sprite.allocate(10, 10), { x: 0, y: 0, w: 10, h: 10, width: 10, height: 10 }, 'first 10x10 bin');
        t.notOk(sprite.allocate(10, 10), 'not enough room');

        sprite.clear();
        t.deepEqual(sprite.allocate(10, 10), { x: 0, y: 0, w: 10, h: 10, width: 10, height: 10 }, 'first 10x10 bin');
        t.end();
    });

    t.test('resize larger succeeds', function(t) {
        var sprite = new ShelfPack(10, 10);
        t.deepEqual(sprite.allocate(10, 10), { x: 0, y: 0, w: 10, h: 10, width: 10, height: 10 }, 'first 10x10 bin');
        t.ok(sprite.resize(20, 10));
        t.deepEqual(sprite.allocate(10, 10), { x: 10, y: 0, w: 10, h: 10, width: 10, height: 10 }, 'second 10x10 bin');
        t.ok(sprite.resize(20, 20));
        t.deepEqual(sprite.allocate(10, 10), { x: 0, y: 10, w: 10, h: 10, width: 10, height: 10 }, 'third 10x10 bin');
        t.end();
    });

    t.test('resize smaller fails', function(t) {
        var sprite = new ShelfPack(10, 10);
        t.notOk(sprite.resize(10, 9));
        t.notOk(sprite.resize(9, 10));
        t.end();
    });

    t.end();
});
