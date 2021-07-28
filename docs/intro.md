---
sidebar_position: 1
---

# Tutorial Intro
### Code Tab

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="ruby"
  values={[
    { label: 'Ruby', value: 'ruby' },
    { label: 'Go', value: 'go' },
  ]
}>
<TabItem value="ruby">

```ruby
class Demo
  def demo
  end
end
```
</TabItem>
<TabItem value="go">

```go

import "fmt"

fmt.printLn("hola")
```

</TabItem>
</Tabs>
