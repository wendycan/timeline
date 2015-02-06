class timeline
  constructor: (options)->
    @SVG_NS = 'http://www.w3.org/2000/svg'
    timeline = document.querySelector(options.element)
    @ele = timeline
    @svgEle = @createSvgElement()
    @data = options.data
    @render()

  render: ->
    @ele.appendChild(@svgEle)
    @drawTimeline()

  createSvgElement: ->
    element = document.createElementNS(@SVG_NS, 'svg')
    element.setAttribute('width', '100%')
    element.setAttribute('height', '250px')

    # Improvement...
    # you should set a viewBox so that when the page scales
    # the whole timeline is still viewable.

    element.classList.add('timeline')
    element

  drawTimeline: ()->
    paper = Snap(@svgEle)
    canvasSize = parseFloat(getComputedStyle(paper.node)["width"])
    start = +@data[0].year
    end = +@data[@data.length - 1].year

    # // add some padding
    start--
    end++
    end++

    range = end - start

    paper.line(0, 200, canvasSize, 200).attr({
      'stroke': 'green',
      'stroke-width': 2
    })

    for datum in @data
      x = canvasSize * (datum.year - start) / range

      paper.circle(x, 200, 6).attr({
        'fill': '#070'
      })

      paper.text(x, 230, datum.year).attr({
        'text-anchor': 'middle'
        'stroke': '#777'
      })

      averageIndex = (datum.values.length - 1) / 2
      xOffsetSize = 24
      for value, index in datum.values
        offset = (index - averageIndex) * xOffsetSize
        paper.text(x + offset, 180, value)
          .attr({
            'text-anchor': 'start'
            'stroke': '#777'
          })
          .transform('r -45 ' + (x + offset) + ' 180')

window.timeline = timeline
