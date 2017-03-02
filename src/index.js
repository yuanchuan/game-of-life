(function() {

  var ROW = 13
  var COL = 61
  var TOTAL = ROW * COL
  var COLOR_DEAD = '#ebedf0'
  var COLOR_ALIVE = '#8cc665'
  var CONTAINER = 'data-gol-container'
  var EMPTY_ROW = repeat(COL, 0).split('').map(function(n) { return +n })

  /**
   *  Based on the `Run Length Encoded` format
   *  http://conwaylife.com/wiki/RLE
   */
  var PATTERNS = {
    "Gosper glider gun -- Bill Gosper 1970": rle(
      36, 9,  '24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8b\
               o3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!'
    ),
    "Queen bee shuttle -- Bill Gosper 1970": rle(
      22, 7,  '9bo12b$7bobo12b$6bobo13b$2o3bo2bo11b2o$2o4bobo11b2o$7bobo12b$9bo!'
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
    "Bi-clock -- Dale Edwin Cole 1971": rle(
      7, 7,   '2bo4b$2o5b$2b2o3b$bo3bob$3b2o2b$5b2o$4bo!'
    ),
    "4-8-12 diamond -- Honeywell group 1971": rle(
      12, 9,  '4b4o4b2$2b8o2b2$12o2$2b8o2b2$4b4o!'
    ),
    "Pinwheel -- Simon Norton 1970": rle(
      12, 12, '6b2o4b$6b2o4b2$4b4o4b$2obo4bo3b$2obo2bobo3b$3bo3b2ob2o$3bobo2bob2o$4b\
               4o4b2$4b2o6b$4b2o!'
    ),
    "Radial pseudo-barberpole -- Gabriel Nivasch 1994": rle(
      13, 13, '10b2ob$2o9bob$o8bo3b$2b2o3bobo3b2$3bobobo5b2$5bobobo3b2$3bobo3b2o2b$3b\
               o8bo$bo9b2o$b2o!'
    ),
    "Tumbler -- George Collins 1970": rle(
      9, 5,   'bo5bob$obo3bobo$o2bobo2bo$2bo3bo2b$2b2ob2o!'
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
    "Octagon 2 -- Arthur Taber 1971": rle(
      8, 8,   '3b2o3b$2bo2bo2b$bo4bob$o6bo$o6bo$bo4bob$2bo2bo2b$3b2o!'
    ),
    "Star -- Hartmut Holzwart 1993": rle(
      11, 11, '4b3o4b2$2bobobobo2b2$obo5bobo$o9bo$obo5bobo2$2bobobobo2b2$4b3o!'
    ),
    "Pentadecathlon -- John Conway 1970": rle(
      10, 3,  '2bo4bo2b$2ob4ob2o$2bo4bo!'
    ),
    "Pentapole -- Unknown 1970": rle(
      8, 8,   '2o6b$obo5b2$2bobo3b2$4bobob$7bo$6b2o!'
    ),
    "Cow -- Unknown": rle(
      40, 7,  '2o7b2o2b2o2b2o2b2o2b2o2b2o2b2o5b$2o4bob3o2b2o2b2o2b2o2b2o2b2o2b2o3b2o$\
               4b2obo29bobo$4b2o3b29o2b$4b2obo30bob$2o4bob3o2b2o2b2o2b2o2b2o2b2o2b2o\
               2b2ob$2o7b2o2b2o2b2o2b2o2b2o2b2o2b2o!'
    ),
    "Ellison p4 HW emulator -- Scot Ellison 2010": rle(
      24, 9,  '11b2o11b$4bo3bo6bo3bo4b$3bobo12bobo3b$3bobo12bobo3b$2obobob10obobob2o$\
               2obo16bob2o$3bo16bo3b$3bobo4b2obo4bobo3b$4b2o4bob2o4b2o!'
    ),
    "Swine -- Scot Ellison 2011": rle(
      37, 10, '33bo$9bo2b2o7bo10bobo$o2b2o2bobobo5bo3bo7bo2b2o$o10bo2bobo3bo4bo2bobob\
               2ob2o$o3bo4bo4b2obobo2bob2obo4b2o$3b2o4bob2obo2bobob2o4bo4bo3bo$2ob2ob\
               obo2bo4bo3bobo2bo10bo$3b2o2bo7bo3bo5bobobo2b2o2bo$2bobo10bo7b2o2bo$3bo!'
    ),
    "Caterer on figure eight -- Unknown": rle(
      18, 6,  '4b2o6bo5b$2bob2o4bo3b4o$bo8bo3bo3b$4bo5bo7b$2obo9bo4b$2o9b2o!'
    ),
    "Almosymmetric -- Unknown 1971": rle(
      9, 8,   '4bo4b$2o2bobo2b$obo6b$7b2o$bo7b$o6bob$2obobo3b$5bo!'
    ),
    "Circle of fire -- Unknown": rle(
      11, 11, '4bobo$2bo2bo2bo$3bobobo$b3obob3o$5bo$5ob5o$5bo$b3obob3o$3bobobo$2bo2\
               bo2bo$4bobo!'
    ),
    "Carnival shuttle -- Robert Wainwright 1984": rle(
      38, 7,  '33bo3bo$2o3b2o26b5o$bobobo3bo2bo6b2o3bo2bo7bo2b$b2ob2o2b2o3b2o4b2o2b2o\
               3b2o4bobob$bobobo3bo2bo6b2o3bo2bo7bo2b$2o3b2o26b5o$33bo3bo!'
    )
  }

  function repeat(times, str) {
    if (str.repeat) return str.repeat(+times)
    return new Array(+times + 1).join(str)
  }

  function ignoreHeadArg(fn) {
    return function() {
      return fn.apply(null, [].slice.call(arguments, 1))
    }
  }

  /**
   *  Transform RLE format into a 2-dimensional array of 0 and 1s
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
    var startx = Math.ceil((ROW - row) / 2)
    var starty = Math.ceil((COL - col) / 2)
    forEachIndex(row, col, function(x, y) {
      board[startx + x][starty + y] = pattern.mapping[x][y]
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
      switch (status) {
        case 0: if (neighbors === 3) status = 1; break
        case 1: if (neighbors <= 1 || neighbors >= 4) status = 0
      }
      return status
    })
  }

  function randomBoxshadows() {
    var pallette = [COLOR_DEAD, COLOR_ALIVE]
    var length = pallette.length
    var shadows = []
    forEachIndex(5, 3, function(x, y) {
      shadows.push([
        ((x + 1) << 2) + 'px',
        ((y + 1) << 2) + 'px',
        0, 0, pallette[Math.floor(Math.random() * length)]
      ].join(' '))
    })
    return shadows.join(',')
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

  var getPosition = function() {
    var position = {}
    forEachIndex(function(x, y) {
      position[getKey(x, y)] = { x: x, y: y }
    })
    return function(key) {
      return position[key] || {}
    }
  }()

  var Canvas = function() {
    var id = 'gol-contribution-board'
    var cells = {}
    var canvas = null
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
        if (canvas) return canvas
        canvas = document.createElement('div')
        canvas.id = id
        canvas.innerHTML = emptyCells
        canvas.addEventListener('click', toggle)
        forEachList(canvas.querySelectorAll('ul'), 'li', function(x, y, elem) {
          var key = getKey(x, y)
          cells[key] = elem
          elem.setAttribute('data-key', key)
        })
        return canvas
      },
      render: function(board, pallette) {
        forEachIndex(function(x, y) {
          var key = getKey(x, y)
          var status = board[x][y]
          fillColor(cells[key], status
            ? (pallette ? pallette[key] : COLOR_ALIVE)
            : COLOR_DEAD
          )
        })
      },
      isEmpty: function() {
        return TOTAL === canvas.querySelectorAll('li[style$="240);"]').length
      },
      animating: function() {
        return animating
      },
      animateBackground: function() {
        animating = true
        var cells = canvas.querySelectorAll('li:not([style$="240);"])')
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
        var mirror = canvas.querySelector('ul:nth-child(6)')

        if (offset(head) - offset(mirror) == 0.5) {
          canvas.style.marginLeft = '-.5px'
        }
      },
      remove: function() {
        cells = {}
        if (canvas) {
          canvas.removeEventListener('click', toggle)
          canvas.parentNode.removeChild(canvas)
          canvas = null
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
      return false
    }
    return {
      build: function() {
        if (controls) return controls
        controls = document.createElement('div')
        controls.id = id
        controls.innerHTML = content
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
      generation: function(count) {
        if (!generation) {
          generation = document.getElementById('gol-generation')
        }
        if (generation) {
          generation.innerHTML = count
        }
      },
      remove: function() {
        buttons = {}
        if (controls) {
          controls.removeEventListener('click', action)
          controls.parentNode.removeChild(controls)
          generation = null
          controls = null
        }
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
      var dx = x + 3, dy = y + 5
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
    if (!Game.running) {
      var p = getPosition(cell.getAttribute('data-key'))
      var x = p.x, y = p.y
      var status = Game.board[x][y]
      fillColor(cell, (status ? COLOR_DEAD : COLOR_ALIVE))
      Game.board[x][y] = (status ? 0 : 1)
      Game._updateGeneration(0)
      Game._updateControls()
    }
  }

  Game._loop = function() {
    if (Game.running) {
      Game.next()
      Game.timer = setTimeout(function() {
        Game._loop()
      }, 80)
    }
  }

  Game.init = function() {
    var graph = document.querySelector('.js-contribution-graph')
    var id = 'gol-button-play'
    if (graph && !document.getElementById(id)) {
      var play = document.createElement('a')
      var legend = document.querySelector('.contrib-legend')
      play.id = id
      play.title = "Play Conway's Game of Life"
      play.innerHTML = 'Play'
      play.addEventListener('click', function(e) {
        Game.play()
        return false
      })
      if (legend) {
        legend.insertBefore(play, legend.firstChild)
      }
    }
  }

  Game.play = function() {
    var gc = Game.container =
      document.querySelector('.js-calendar-graph').parentNode
    gc.setAttribute(CONTAINER, '')
    gc.appendChild(Canvas.build())
    gc.appendChild(Controls.build())

    Game.reset(true)
    Canvas.fixAlignment();
    Controls
      .apply('hide', 'pause')
      .apply('setTitle', 'reset', 'select pattern')
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
      Game._updateControls()
    }
  }

  Game.clear = function() {
    Canvas.render(Game.board = createStatusBoard())
    Game._updateGeneration(0)
    Game._updateControls()
    Controls.apply('setTitle', 'reset', 'select pattern')
  }

  Game.reset = function(begin) {
    if (Canvas.animating()) return false
    Game.pause()

    if (begin) {
      var initial = Game._getIntialStatus()
      Canvas.render(
        Game.board = initial.board,
        initial.pallette
      )
    } else {
      var nextPattern = Game._getNextPattern()
      var board = createBoardByPattern(nextPattern.pattern)
      Controls.apply('setTitle', 'reset', nextPattern.name)
      Canvas.render(Game.board = board)
    }

    Controls.apply('setShadow', 'reset', randomBoxshadows())
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

  var container = document.getElementById('js-pjax-container')
  var loaderBar = document.getElementById('js-pjax-loader-bar')
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
