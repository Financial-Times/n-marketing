# n-marketing

A bower component containing templates and logic for first party marketing and messaging.

Currently n-marketing only contains the coloquially named 'Lionel-slider' but this may expand into a set of wider marketing components in future.

### Current features
#### Marketing slider (aka 'Lionel Slider')
A sliding popup based on `n-sliding-popup` used for subscription discount messaging for anonymous users

### Integration guide:
To use n-marketing in your app add it as a bower dependency using `bower install n-marketing`
Require it into your `app.js` file (or similar)
```
import subscriptionOfferPrompt from 'n-marketing';
```
Initialise it by calling it with an object containing flags, and a boolean to determine whether to render in demo mode
```
subscriptionOfferPrompt({flags, demoMode});
```

### Local dev guide (make demo)
use `make demo` to run the component locally and see any changes, bypassing the logic that determines whether the slider is shown

The demo function takes two parameters
- `countryCode` an ISO country code string. Use this to see how different currencies and location specific offers display
- `withDiscount` a boolean indicating whether an additional discount is being applied to the slider, the logic for which sits in `lionel.js`

Paramaters passed to the demo are hardcoded in `index.js`, change them manually to view variations of the slider:

```
if (demoMode) return lionel.render('GBR', false);
```
### Deployment (tagging)
To deploy a new version of `n-marketing` publish a new release in github using an appropriate `semver` tag, or tag the release using the command line

### todo:
- unit tests
  

