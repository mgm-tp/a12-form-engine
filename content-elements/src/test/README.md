1. Implement dependency injection yourself through configuration maps (WidgetMap, ...).
2. Use jest spies and stubs.
3. To test DOM events we can use real widgets, but only test the behavior of our component (the DOM event). We assume, that there will only be a few tests of this kind.
    a. (mock everything else, that's not necessary.
