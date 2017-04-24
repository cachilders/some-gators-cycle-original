import {input, div, p, img} from '@cycle/dom'
import xs from 'xstream'
import assets from './assets';

export function App (sources) {
  const width$ = sources.DOM.select('.width').events('input')
    .map(e => e.target.value).startWith(410);
  const index$ = sources.DOM.select('img').events('click')
    .mapTo(+1)
    .fold((x, y) => x + y < assets.slides.length ? x + y : 0, 0);

  const state$ = xs.combine(index$, width$);
  
  const vtree$ = state$.map(([index, width]) =>
    div({style: {
      textAlign: 'center',
      fontFamily: 'sans-serif',
      fontWeight: '300'
    }}, [
      div({style: {marginBottom: '20px'}}, [
        p({style:{color: '#858576', fontSize: '32px'}},
          assets.captions[index]
        ),
        input(
          {
            style: {width: '100px', cursor: 'pointer'},
            attrs: {
              class: 'width',
              type: 'range',
              min: 40,
              max: 720,
              value: width
            }
          }
        )
      ]),
      div([
        img({
          style: {borderRadius: '12px', cursor: 'pointer'},
          attrs: {
            src: assets.slides[index],
            alt: assets.captions[index],
            width: `${width}px`
          }
        })
      ])
    ])
  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
