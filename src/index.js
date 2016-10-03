(function() {

  var ROW = 13
  var COL = 60
  var TOTAL = ROW * COL
  var COLOR_DEAD = '#eeeeee'
  var COLOR_ALIVE = '#8cc665'
  var CONTAINER = 'data-gol-container'
  var EMPTY_ROW = repeat(COL, 0).split('').map(function(n) { return +n })

  /**
   *  Bassed on the Run Length Encoded format:
   *  http://conwaylife.com/wiki/RLE
   */
  var PATTERNS = {
    "Gosper glider gun -- Bill Gosper 1970": rle(
      36, 9, '24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8b\
              o3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!'
    ),
    "Lightweight spaceship -- John Conway 1970": rle(
      5, 4,   'bo2bo$o4b$o3bo$4o!'
    ),
    "Washerwoman -- Earl Abbe 1971": rle(
      56, 5,  'o55b$2o4bo5bo5bo5bo5bo5bo5bo5bo5bob$3o2bobo3bobo3bobo3bobo3bobo3bobo3b\
               obo3bobo3bobo$2o4bo5bo5bo5bo5bo5bo5bo5bo5bob$o!'
    ),
    "Ants -- Unknown": rle(
      44, 4,  '2o3b2o3b2o3b2o3b2o3b2o3b2o3b2o3b2o2b$2b2o3b2o3b2o3b2o3b2o3b2o3b2o3b2o\
               3b2o$2b2o3b2o3b2o3b2o3b2o3b2o3b2o3b2o3b2o$2o3b2o3b2o3b2o3b2o3b2o3b2o3b\
               2o3b2o!'
    ),
    "Glider -- Richard K. Guy 1970": rle(
      3, 3,   'bob$2bo$3o!'
    ),
    "Bi-clock -- Dale Edwin Cole 1971": rle(
      7, 7,   '2bo4b$2o5b$2b2o3b$bo3bob$3b2o2b$5b2o$4bo!'
    ),
    "Beacon -- John Conway 1970": rle(
      4, 4,   '2o2b$o3b$3bo$2b2o!'
    ),
    "$rats -- David Buckingham 1972": rle(
      12, 11, '5b2o5b$6bo5b$4bo7b$2obob4o3b$2obo5bobo$3bo2b3ob2o$3bo4bo3b$4b3obo3b$7b\
               o4b$6bo5b$6b2o!'
    ),
    "Pinwheel -- Simon Norton 1970": rle(
      12, 12, '6b2o4b$6b2o4b2$4b4o4b$2obo4bo3b$2obo2bobo3b$3bo3b2ob2o$3bobo2bob2o$4b\
               4o4b2$4b2o6b$4b2o!'
    ),
    "Tumbler -- George Collins 1970": rle(
      9, 5,   'bo5bob$obo3bobo$o2bobo2bo$2bo3bo2b$2b2ob2o!'
    ),
    "Bent keys -- Dean Hickerson 1989": rle(
      12, 5,  'bo8bob$obo6bobo$bob2o2b2obob$4bo2bo4b$4bo2bo!'
    ),
    "Turning toads -- Dean Hickerson 1989": rle(
      37, 8,  '15bo6bo14b$14b2o5b2o6b2o6b$6b3obobob2obobob2obobo10b$2b2obo6bobo4bobo\
               4bobo2bob2o2b$o2bobo3bo18b4obo2bo$2obobo27bob2o$3bo29bo3b$3b2o27b2o!'
    ),
    "38P7.2 -- Nicolay Beluchenko 2009": rle(
      13, 11, '4bo3bo4b$o2bobobobo2bo$obo2bobo2bobo$bo2b2ob2o2bob$5bobo5b$2b2o5b2o2b$\
               2bo7bo2b$4bo3bo4b2$bo2bo3bo2bob$2b2o5b2o!'
    ),
    "Blonker -- Nicolay Beluchenko 2004": rle(
      12, 8,  'o2b2o4bo$2o2bob2obo$4bobo$5b2o$7bo$7bo3bo$9bobo$10bo!'
    ),
    "Dinner Table -- Robert Wainwright 1972": rle(
      13, 13, 'bo11b$b3o7b2o$4bo6bob$3b2o4bobob$9b2o2b$6bo6b$4b2obo5b2$2bo3bo2bo3b$bo\
               b2o4bo3b$bo6bo4b$2o7b3ob$11bo!'
    ),
    "Octagon 2 -- Arthur Taber 1971": rle(
      8, 8,   '3b2o3b$2bo2bo2b$bo4bob$o6bo$o6bo$bo4bob$2bo2bo2b$3b2o!'
    ),
    "4-8-12 diamond --- Honeywell group 1971": rle(
      12, 9,  '4b4o4b2$2b8o2b2$12o2$2b8o2b2$4b4o!'
    ),
    "Worker bee -- David Buckingham 1972": rle(
      16, 11, '2o12b2o$bo12bob$bobo8bobob$2b2o8b2o2b2$5b6o5b2$2b2o8b2o2b$bobo8bobob$b\
               o12bob$2o12b2o!'
    ),
    "Blinker fuse -- Unknown": rle(
      25, 5,  '2o2bob2o17b$5obobo16b$8bob3ob3ob3ob3o$5obobo16b$2o2bob2o!'
    ),
    "Caterer -- Dean Hickerson 1989": rle(
      8, 6,   '2bo5b$o3b4o$o3bo3b$o7b$3bo4b$b2o!'
    ),
    "Pseudo-barberpole -- Achim Flammenkamp 1994": rle(
      12, 12, '10b2o$11bo$9bo2b$7bobo2b2$5bobo4b2$3bobo6b2$2b2o8b$o11b$2o!'
    ),
    "Radial pseudo-barberpole -- Gabriel Nivasch": rle(
      13, 13, '10b2ob$2o9bob$o8bo3b$2b2o3bobo3b2$3bobobo5b2$5bobobo3b2$3bobo3b2o2b$3b\
               o8bo$bo9b2o$b2o!'
    ),
    "Cow -- Unknown": rle(
      40, 7,  '2o7b2o2b2o2b2o2b2o2b2o2b2o2b2o5b$2o4bob3o2b2o2b2o2b2o2b2o2b2o2b2o3b2o$\
               4b2obo29bobo$4b2o3b29o2b$4b2obo30bob$2o4bob3o2b2o2b2o2b2o2b2o2b2o2b2o\
               2b2ob$2o7b2o2b2o2b2o2b2o2b2o2b2o2b2o!'
    )
  }

  function repeat(times, str) {
    if (str.repeat) return str.repeat(times)
    return new Array(times + 1).join(str)
  }

  function ignoreHeadArg(fn) {
    return function() {
      return fn.apply(null, [].slice.call(arguments, 1))
    }
  }

  /**
   *  Transform RLE format to a 2-dimensional array of 0 and 1s
   */
  function rle(x, y, pattern) {
    return {
      row: y,
      col: x,
      mapping: pattern
        .replace(/(\d+)(\$)/g, ignoreHeadArg(repeat))
        .split('$')
        .map(function(line) {
          var pat = line
            .replace(/\!|\s+/g, '')
            .replace(/(\d+)([bo])/g, ignoreHeadArg(repeat))
          pat += repeat(x - pat.length, 'b')
          return pat.split('').map(function(c) {
            return c === 'b' ? 0 : 1
          })
        })
    }
  }

  function forEachIndex(row, col, fn) {
    if (typeof row === 'function') {
      (fn = row, row = ROW, col = COL)
    }
    for (var x = 0; x < row; ++x) {
      for (var y = 0; y < col; ++y) {
        fn(x, y)
      }
    }
  }

  function forEachList(list, childSelector, fn) {
    if (typeof childSelector === 'function') {
      fn = childSelector
      for (var i = 0; i < list.length; ++i) {
        fn(i, list[i])
      }
    } else {
      for (var x = 0; x < list.length; ++x) {
        var sublist = list[x].querySelectorAll(childSelector)
        for (var y = 0; y < sublist.length; ++y) {
          fn(y, x, sublist[y])
        }
      }
    }
  }

  function createStatusBoard(fn) {
    var board = []
    for (var i = 0; i < ROW; ++i) {
      board.push(EMPTY_ROW.slice(0))
    }
    forEachIndex(function(x, y) {
      board[x][y] = fn ? fn(x, y) : 0
    })
    return board
  }

  function createBoardByPattern(pattern) {
    var board = createStatusBoard()
    var row = pattern.row
    var col = pattern.col
    var startRow = Math.floor((ROW - row) / 2)
    var startCol = Math.floor((COL - col) / 2)
    forEachIndex(row, col, function(x, y) {
      board[startRow + x][startCol + y] = pattern.mapping[x][y]
    })
    return board
  }

  function countNeighbors(board, x, y) {
    var x0 = (x > 0)
    var xr = (x < ROW - 1)
    var y0 = (y > 0)
    var yr = (y < COL - 1)
    return (
      ((x0 && y0) ? board[x - 1][y - 1] : 0) +
      (y0         ? board[x][y - 1]     : 0) +
      ((xr && y0) ? board[x + 1][y - 1] : 0) +
      (x0         ? board[x - 1][y]     : 0) +
      (xr         ? board[x + 1][y]     : 0) +
      ((x0 && yr) ? board[x - 1][y + 1] : 0) +
      (yr         ? board[x][y + 1]     : 0) +
      ((xr && yr) ? board[x + 1][y + 1] : 0)
    )
  }

  function next(board) {
    return createStatusBoard(function(x, y) {
      var neighbors = countNeighbors(board, x, y)
      var status = board[x][y]
      switch(status) {
        case 0: if (neighbors === 3) status = 1; break
        case 1: if (neighbors <= 1 || neighbors >= 4) status = 0
      }
      return status
    })
  }

  function generateBoxshadow() {
    var pallette = ['#eeeeee', '#d6e685', '#8cc665', '#44a340']
    var boxshadows = []
    forEachIndex(5, 3, function(x, y) {
      var color = pallette[Math.floor(Math.random() * pallette.length)]
      boxshadows.push([
        ((x + 1) * 4) + 'px',
        ((y + 1) * 4) + 'px',
        0, 0, color
      ].join(' '))
    })
    return boxshadows.join(',')
  }

  function isTagName(name, el) {
    if (el) {
      return el.tagName.toLowerCase() === name
    }
  }

  function setTransitonDelay(el, delay) {
    if (el) {
      el.style.transitionDelay = el.style.webkitTransitionDelay = delay
    }
  }

  function fillColor(cell, color) {
    if (cell) {
      if (isTagName('rect', cell)) {
        return cell.getAttribute('fill')
      }
      return color
        ? (cell.style.backgroundColor = color)
        : cell.style.backgroundColor
    }
  }

  function getKey(x, y) {
    return x + '-' + y
  }

  var getPosition = (function() {
    var position = {}
    forEachIndex(function(x, y) {
      position[getKey(x, y)] = { x: x, y: y }
    })
    return function(key) {
      return position[key] || {}
    }
  }())

  var Canvas = function() {
    var id = 'gol-contribution-board'
    var cells = {}
    var board = null
    var animating = false
    var emptyCells = repeat(COL,
      '<ul>' + repeat(ROW, '<li></li>') + '</ul>'
    )
    function toggle(e) {
      e.stopPropagation()
      var cell = e.target
      if (isTagName('li', cell)) {
        Canvas.ontoggle && Canvas.ontoggle(cell)
      }
    }
    return {
      build: function() {
        if (board) return board
        board = document.createElement('div')
        board.id = id
        board.innerHTML = emptyCells
        board.addEventListener('click', toggle)
        forEachList(board.querySelectorAll('ul'), 'li', function(x, y, elem) {
          var key = getKey(x, y)
          cells[key] = elem
          elem.setAttribute('data-key', key)
        })
        return board
      },
      render: function(statusBoard, pallette) {
        forEachIndex(function(x, y) {
          var key = getKey(x, y)
          var status = statusBoard[x][y]
          fillColor(cells[key], status
            ? (pallette ? pallette[key] : COLOR_ALIVE)
            : COLOR_DEAD
          )
        })
      },
      isEmpty: function() {
        return TOTAL === board.querySelectorAll('li[style$="238);"]').length
      },
      animating: function() {
        return animating
      },
      animateBackground: function() {
        animating = true
        var cells = board.querySelectorAll('li:not([style$="238);"])')
        forEachList(cells, function(_, cell) {
          setTransitonDelay(cell, (600 * Math.random()) + 'ms')
        })
        setTimeout(function() {
          forEachList(cells, function(_, cell) {
            cell.style.backgroundColor = COLOR_ALIVE
          })
        })
        setTimeout(function() {
          forEachList(cells, function(_, cell) {
            setTransitonDelay(cell, '')
          })
          animating = false
        }, 600)
      },
      fixAlignment: function() {
        var offset = function(el) {
          return el && el.getBoundingClientRect().left
        }
        var head = document.querySelector('.js-calendar-graph-svg > g > g:first-child')
        var mirror = board.querySelector('ul:nth-child(5)')
        if (offset(head) - Math.ceil(offset(mirror)) == 1.5) {
          board.style.marginLeft = '1px'
        }
      },
      remove: function() {
        cells = {}
        if (board) {
          board.removeEventListener('click', toggle)
          board.parentNode.removeChild(board)
          board = null
        }
      }
    }
  }()

  var Controls = function() {
    var id = 'gol-controls'
    var controls = null
    var generation = null
    var buttons = {}
    var actions = ['reset', 'run', 'pause', 'next', 'clear', 'close']
    var content = '<span id="gol-generation">0</span>' + (
      actions.map(function(name) {
        var content = (name === 'reset' ? '<span id="gol-pattern-shadow"></span>' : '')
        return '<a data-action="' + name + '">' + content + '</a>'
      }).join('')
    )
    function action(e) {
      var btn = e.target
      if (btn.hasAttribute('data-action') && !btn.hasAttribute('disabled')) {
        Controls.onclick && Controls.onclick(btn)
      }
    }
    return {
      build: function() {
        if (controls) return controls
        controls = document.createElement('div')
        controls.id = id
        controls.innerHTML = content
        generation = controls.querySelector('#gol-generation')
        actions.forEach(function(name) {
          buttons[name] = controls.querySelector('[data-action="' + name + '"]')
        })
        controls.addEventListener('click', action)
        return controls
      },
      apply: function(operation, names, value) {
        if (!Array.isArray(names)) names = [names]
        names.forEach(function(name) {
          var btn = buttons[name]
          switch (operation) {
            case 'disable': btn.setAttribute('disabled', true); break
            case 'enable': btn.removeAttribute('disabled'); break
            case 'show': btn.style.display = ''; break
            case 'hide': btn.style.display = 'none'; break
            case 'setTitle': btn.title = value; break
            case 'setShadow': btn.firstChild.style.boxShadow = value
          }
        })
        return this
      },
      remove: function() {
        buttons = {}
        if (controls) {
          controls.removeEventListener('click', action)
          controls.parentNode.removeChild(controls)
          generation = null
          controls = null
        }
      },
      generation: function(count) {
        generation.innerHTML = count
      }
    }
  }()

  var Game = {
    generation: 0,
    running: false,
    timer: null,
    container: null,
    board: null
  }

  Game._getIntialStatus = function() {
    var board = createStatusBoard()
    var gs = Game.container.querySelectorAll('.js-calendar-graph-svg > g > g')
    var pallette = {}
    forEachList(gs, 'rect', function(x, y, rect) {
      var color = fillColor(rect)
      var dx = x + 3, dy = y + 4
      board[dx][dy] = (color === COLOR_DEAD) ? 0 : 1
      pallette[getKey(dx, dy)] = color
    })
    return { board: board, pallette: pallette }
  }

  Game._getNextPattern = function() {
    var names = Object.keys(PATTERNS)
    var max = names.length
    var index = 0
    return function() {
      if (index >= max) {
        index = 0
      }
      var name = names[index++]
      return {
        name: name,
        pattern: PATTERNS[name]
      }
    }
  }()

  Game._updateControls = function() {
    Game.running
      ? Controls
        .apply('disable', ['next', 'clear', 'reset'])
        .apply('show', 'pause')
        .apply('hide', 'run')
      : Controls
        .apply('enable', 'reset')
        .apply('show', 'run')
        .apply('hide', 'pause')
        .apply(
          (Canvas.isEmpty() ? 'disable' : 'enable'),
          ['run', 'next', 'clear']
        )
  }

  Game._updateGeneration = function(count) {
    Controls.generation(Game.generation = count)
  }

  Game._ontoggle = function(cell) {
    if (Game.running) return false
    var mapping = {
      color: [COLOR_ALIVE, COLOR_DEAD], status: [1, 0]
    }
    var p = getPosition(cell.getAttribute('data-key'))
    var status = Game.board[p.x][p.y]
    fillColor(cell, mapping.color[status])
    Game.board[p.x][p.y] = mapping.status[status]
    Game._updateGeneration(0)
    Game._updateControls()
  }

  Game._loop = function() {
    if (!Game.running) return false
    Game.next()
    Game.timer = setTimeout(function() {
      Game._loop()
    }, 80)
  }

  Game.init = function() {
    var graph = document.querySelector('.js-contribution-graph')
    if (!graph) return false
    var id = 'gol-button-play'
    if (document.getElementById(id)) return false
    var play = document.createElement('a')
    play.id = id
    play.title = "Play Conway's Game of Life"
    play.innerHTML = 'Play'
    play.addEventListener('click', function(e) {
      e.preventDefault()
      Game.play()
    })
    var legend = document.querySelector('.contrib-legend')
    legend.insertBefore(play, legend.firstChild)
  }

  Game.play = function() {
    var gc = Game.container = document.querySelector('.js-calendar-graph').parentNode
    gc.setAttribute(CONTAINER, '')
    gc.appendChild(Canvas.build())
    gc.appendChild(Controls.build())

    Game.reset(true)
    Canvas.fixAlignment()
    Controls
      .apply('hide', ['pause'])
      .onclick = function(btn) {
        var action = Game[btn.getAttribute('data-action')]
        action && action()
      }
  }

  Game.run = function() {
    Game.running = true
    Game.container.setAttribute(CONTAINER, 'running')
    Game._loop()
    Game._updateControls()
  }

  Game.next = function() {
    Canvas.render(Game.board = next(Game.board))
    Game._updateGeneration(++Game.generation)
    if (Canvas.isEmpty()) {
      Game._updateControls()
      return Game.pause()
    }
  }

  Game.pause = function() {
    clearTimeout(Game.timer)
    Game.running = false
    if (Game.container) {
      Game.container.setAttribute(CONTAINER, '')
    }
    Game._updateControls()
  }

  Game.clear = function() {
    Canvas.render(Game.board = createStatusBoard())
    Game._updateGeneration(0)
    Game._updateControls()
    Controls.apply('setTitle', 'reset', '')
  }

  Game.reset = function(begin) {
    if (Canvas.animating()) return false
    Game.pause()
    if (begin) {
      var initial = Game._getIntialStatus()
      Canvas.render(Game.board = initial.board, initial.pallette)
    } else {
      var pattern = Game._getNextPattern()
      var board = createBoardByPattern(pattern.pattern)
      Controls.apply('setTitle', 'reset', pattern.name)
      Canvas.render(Game.board = board)
    }

    Controls.apply('setShadow', 'reset', generateBoxshadow())

    Canvas.ontoggle = Game._ontoggle
    Canvas.animateBackground()
    Game._updateGeneration(0)
    Game._updateControls()
  }

  Game.close = function() {
    if (Game.container) {
      Game.pause()
      Game.container.removeAttribute(CONTAINER)
      Canvas.remove()
      Controls.remove()
      Game.container = null
    }
  }

  Game.init()

  var container = document.querySelector('#js-pjax-container')
  var loaderBar = document.querySelector('#js-pjax-loader-bar')
  var maxAttempt = 100
  var isDetecting = false

  if (!container) return false
  container.addEventListener('click', function(e) {
    if (!isDetecting) {
      var link = e.target
      if (isTagName('span', link)) {
        link = e.target.parentNode
      }
      if (isTagName('a', link)
        && /underline\-nav\-item|js\-year\-link/.test(link.className)) {
        Game.close()
        detectPjaxEnd(function() {
          Game.init()
        }, maxAttempt)
      }
    }
  })

  function detectPjaxEnd(fn, attempt) {
    if (!attempt) {
      return isDetecting = false
    }
    isDetecting = true
    setTimeout(function() {
      if (/is\-loading/.test(loaderBar.className)
        || document.getElementById('gol-button-play')) {
        detectPjaxEnd(fn, --attempt)
      } else {
          setTimeout(function() {
            isDetecting = false
            fn()
          }, 500)
      }
    }, 500)
  }

}())
