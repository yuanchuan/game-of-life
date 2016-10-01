(function() {

  var ROW = 13
  var COL = 60
  var TOTAL = ROW * COL
  var COLOR_DEAD = '#eeeeee'
  var COLOR_ALIVE = '#8cc665'
  var CONTAINER = 'data-gol-container'
  var EMPTY_ROW = repeat(COL, 0).split('').map(function(n) { return +n })

  function repeat(times, str) {
    if (str.repeat) return str.repeat(times)
    return new Array(times + 1).join(str)
  }

  function forEachIndex(fn) {
    for (var x = 0; x < ROW; ++x) {
      for (var y = 0; y < COL; ++y) {
        fn(x, y)
      }
    }
  }

  function forEachList(list, childSelector, fn) {
    if (typeof childSelector === 'function') {
      for (var i = 0; i < list.length; ++i) {
          childSelector(i, list[i])
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

  function countNeighbors(board, x, y) {
    var xa = x ? (x - 1) : (ROW - 1),
      xc = (x == (ROW - 1)) ? 0 : (x + 1),
      ya = y ? (y - 1) : (COL - 1),
      yc = ( y == (COL - 1)) ? 0 : (y + 1)
    return (
      board[xa][ya] + board[x][ya] + board[xc][ya] +
      board[xa][y]  +              + board[xc][y]  +
      board[xa][yc] + board[x][yc] + board[xc][yc]
    )
  }

  function next(board) {
    return createStatusBoard(function(x, y) {
      var neighbors = countNeighbors(board, x, y)
      var status = board[x][y]
      switch(status) {
        case 1: if (neighbors <= 1 || neighbors >= 4) status = 0
        case 0: if (neighbors === 3) status = 1
      }
      return status
    })
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

  var GameBoard = (function() {
    var id = 'gol-contribution-board'
    var cells = {}
    var board = null
    var emptyCells = repeat(COL,
      '<ul>' + repeat(ROW, '<li></li>') + '</ul>'
    )
    function toggle(e) {
      var cell = e.target
      if (isTagName('li', cell)) {
        GameBoard.ontoggle && GameBoard.ontoggle(cell)
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
      render: function(statusBoard, colors) {
        forEachIndex(function(x, y) {
          var key = getKey(x, y)
          var status = statusBoard[x][y]
          fillColor(cells[key], status
            ? (colors ? colors[key] : COLOR_ALIVE)
            : COLOR_DEAD
          )
        })
      },
      isEmpty: function() {
        return TOTAL === board.querySelectorAll('li[style$="238);"]').length
      },
      animateBackground: function() {
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
  }())

  var Controls = (function() {
    var id = 'gol-controls'
    var controls = null
    var generation = null
    var buttons = {}
    var actions = ['run', 'pause', 'next', 'clear', 'reset', 'close']
    var content = '<span id="gol-generation">0</span>' + (
      actions.map(function(name) { return '<a data-action="' + name + '"></a>' }).join('')
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
      apply: function(operation, names) {
        if (!Array.isArray(names)) names = [names]
        names.forEach(function(name) {
          var btn = buttons[name]
          switch (operation) {
            case 'disable': btn.setAttribute('disabled', true); break
            case 'enable': btn.removeAttribute('disabled'); break
            case 'show': btn.style.display = ''; break
            case 'hide': btn.style.display = 'none'
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
  }())

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
    var colors = {}
    forEachList(gs, 'rect', function(x, y, rect) {
      var color = fillColor(rect)
      var dx = x + 3, dy = y + 4
      board[dx][dy] = (color === COLOR_DEAD) ? 0 : 1
      colors[getKey(dx, dy)] = color
    })
    return { board: board, colors: colors }
  }

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
          (GameBoard.isEmpty() ? 'disable' : 'enable'),
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
    gc.appendChild(GameBoard.build())
    gc.appendChild(Controls.build())

    Game.reset()
    GameBoard.fixAlignment()
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
    GameBoard.render(Game.board = next(Game.board))
    Game._updateGeneration(++Game.generation)
    if (GameBoard.isEmpty()) {
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
    GameBoard.render(Game.board = createStatusBoard())
    Game._updateGeneration(0)
    Game._updateControls()
  }

  Game.reset = function() {
    Game.pause()
    var intial = Game._getIntialStatus()
    GameBoard.render(Game.board = intial.board, intial.colors)
    GameBoard.ontoggle = Game._ontoggle
    GameBoard.animateBackground()
    Game._updateGeneration(0)
    Game._updateControls()
  }

  Game.close = function() {
    if (Game.container) {
      Game.pause()
      Game.container.removeAttribute(CONTAINER)
      GameBoard.remove()
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
