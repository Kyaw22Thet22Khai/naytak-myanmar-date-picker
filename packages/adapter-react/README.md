# Naytak Myanmar React Calendar

A reusable React calendar component for displaying Myanmar lunar dates, powered by naytak-calendar-core.

## Features

- Displays both Gregorian and Myanmar lunar dates
- Select dates via calendar grid or dropdowns
- Returns both Gregorian and Myanmar lunar date info on selection
- Modern, customizable UI

## Installation

```
npm install naytak-myanmar-react-calendar
```

## Usage

```tsx
import React, { useState } from "react";
import { MyanmarCalendarComponent } from "naytak-myanmar-react-calendar";

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <MyanmarCalendarComponent
        onChange={({ gregorian, myanmar }) =>
          setSelected({ gregorian, myanmar })
        }
      />
      {selected && (
        <div>
          <h3>Selected Date:</h3>
          <div>Gregorian: {selected.gregorian.toLocaleDateString()}</div>
          <div>
            Myanmar: {selected.myanmar.myanmarYear}{" "}
            {selected.myanmar.myanmarMonth} {selected.myanmar.phase}{" "}
            {selected.myanmar.day}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Props

| Prop     | Type     | Description                                      |
| -------- | -------- | ------------------------------------------------ |
| year     | number   | (Optional) Initial Gregorian year                |
| month    | number   | (Optional) Initial Gregorian month (1-12)        |
| onChange | function | Callback with `{ gregorian, myanmar }` on select |

## Myanmar Lunar Date Object

The `myanmar` object returned in `onChange` has:

- `myanmarYear`: number
- `myanmarMonth`: string (English key, e.g. "Pyatho")
- `phase`: "Waxing" | "Waning" | "Full Moon" | "New Moon"
- `day`: number
- `watat`: boolean
- `monthIndex`: number

## Styling

The component includes a default CSS file. You can override styles by targeting the provided class names.

## License

MIT
