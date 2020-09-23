---
title: The plugin system
description: How to extend Lightquery
lang: en-US
---
# The plugin system

:::tip
```typescript
type PluginType = "instance" | "global";
```
:::

Global and instance plugins can share the same name as they are stored on a different "repository".
In all the function signatures, `pluginType` defaults to `"instance"`.

## Check for the existence of a plugin
:::tip
```typescript
declare function hasPlugin(pluginName: string, pluginType?: PluginType);
```
:::

`µ.hasPlugin(pluginName, pluginType)` allows to check for the existence of a plugin.
Note that in strict mode, if you try to check for the existence of a core method an exception will be thrown (`InvalidArgumentError`).

This can be useful to only register a plugin once (as registering it twice will also throw an exception in strict mode).

## Register a plugin
:::tip
```typescript
declare function registerPlugin(pluginName: string, plugin: Function|any, pluginType?: PluginType);
```
:::

For flexibility purposes, you can not only register a method but you can also register a property:
```javascript
µ.registerPlugin("life", 42, "global");
µ.hasPlugin("life", "global"); //-> true
µ.life; //-> 42
```

At first I was going to only allow methods but decided that this allows much more flexibility (e.g. adding a JSON client directly as a property).

As pointed out earlier, global and instance plugins are not stored in the same place, thus you can give them the same name:
```javascript
µ.registerPlugin("life", 42, "global");
µ.hasPlugin("life", "global"); //-> true
µ.life; //-> 42

µ.registerPlugin("life", 420);
µ.hasPlugin("life"); //-> true
µ("body").life; //-> 420
µ.life; //-> 42
```

Trying to register a plugin twice or use a core method's name will result in an exception being thrown (in strict mode, otherwise it's a noop):
```javascript
µ.registerPlugin("life", 42);
µ.registerPlugin("life", 420); //-> throws InvalidArgumentError
µ.registerPlugin("css", null); //-> throws InvalidArgumentError
```

## Remove a plugin
:::tip
```typescript
declare function removePlugin(pluginName: string, pluginType?: PluginType);
```
:::

```javascript
µ.registerPlugin("life", 42);
µ.hasPlugin("life"); //-> true
µ.removePlugin("life");
µ.hasPlugin("life"); //-> false
```

Just like registering a plugin, trying to remove a non existent plugin or a core method will result in an exception being thrown (in strict mode).

```javascript
µ.removePlugin("css"); //-> throws InvalidArgumentError
µ.removePlugin("unknownPlugin"); //-> throws InvalidArgumentError
```
