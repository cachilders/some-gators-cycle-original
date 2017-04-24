import {input, div, p, img} from '@cycle/dom';
import xs from 'xstream'; // (https://github.com/staltz/xstream)
import assets from './assets';

export function App (sources) {
  const width$ = sources.DOM.select('.width').events('input')
    .map(e => e.target.value).startWith(410); // map, but for events in time
  const index$ = sources.DOM.select('img').events('click')
    .mapTo(1) // converts stream events into the supplied value every time
    .fold( // like reduce, but for streams (https://github.com/staltz/xstream#fold)
      (acc, int) => acc + int < assets.slides.length ? acc + int : 0, 0
    );
  
  const vtree$ = xs.combine(index$, width$).map(([index, width]) =>
    div({style: { // this is HyperScript (https://github.com/hyperhype/hyperscript)
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
  );
  const sinks = {
    DOM: vtree$ // the $ isn't magic – it's just a naming convention for streams
  };
  return sinks;
}
