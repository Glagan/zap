# zap

*zap* is a library to display simple yet customizable notifications.
You can stylize text with a simple syntax, add buttons to make the notifications interactable and add callbacks for some events during the life of a notification.

You can find a live demo here: [https://zap.nikurasu.org/](https://zap.nikurasu.org/)
You can also run the demo locally by installing the dependencies and then run ``yarn run dev``.

<p align="center">
    <img width="320" height="92" src="screenshots/info.png">
</p>

## Installation

```bash
npm install @glagan/zap # or yarn add @glagan/zap
```

## How to use

*zap* needs a container to display the notification, you need to have the component ``ZapContainer`` included somewhere, e.g in your index.

```svelte
<script>
	import { ZapContainer } from '@glagan/zap';
</script>

<ZapContainer />
```

Once the container is available, you can display notifications by interacting with the ``notifications`` store.

```svelte
<script>
	import { zap } from '@glagan/zap';

	zap.success({ title: 'zap' });
</script>

<ZapContainer />
```

## Templates

There is 5 default templates: ``success``, ``error``, ``info``, ``warning`` and ``message``.

```javascript
zap.success({
    title: 'Title', // The title of the notification
    image: 'url', // Optional image displayed inside the notification
    imageAlt: 'image', // Optional image alt text
    message: 'Content', // Content of the notification
    // Optional list of buttons to interact with the notification
    buttons: [{
        value: 'Confirm', // The text inside the button
        type: 'success', // The type of the button, same as for the notifications
        onClick: (notification) => {
            // The onClick function receive the notification from which the button has been clicked
            // You can call notification.remove(), notification.close() or notification.closeFadeout()
            // if you wish to remove the notification by clicking on  the buttons
        }
    }]
}, options); // See the the list of options below
```

> All keys in the first parameter are optional, but at least one of title, image or message is required.

You can still update the content and state of any notification after it's been created by updating the values in the ``Notification`` object that was returned by zap:


```javascript
const notification = zap.success({ title: 'zap' });
notification.title = 'ZAP';
notification.repaint(); // A repaint() call is necessary (for now ?)
```

## Options

There are a few options that you can set by using ``zapOptions.setDefault(options)`` or more specifically for a single notification on the third parameter.

| Name | Description | Default |
|---|---|---|
| duration | The time (in ms) that the notification is displayed. | 4000 |
| position | Valid positions: ``top-left``, ``top-center``, ``top-right``, ``bottom-left``, ``bottom-center`` and ``bottom-right``. | "top-right" |
| sticky | If true, the notification will not disappear until the user clicks it or its close button. | false |
| closeButton | If true, a close button will be added either on the title or the content. | true |
| closeOnClick | If true, clicking anywhere in the notification will close it. | true |
| removeAllOnDisplay | If true, all notifications will be cleared before the new one is added to the screen. | false |
| maxNotifications | If >0, notifications (starting with oldest) will clear out until the number displayed is less than or equal to the specified option. | 0 |
| events | Object with events functions, see [Events](#Events). |
| insertAnimation | Object with CSS class name and duration, see [Animations](#Animations). | ``{ name: 'default-insert', duration: 250 }`` |
| removeAnimation | Object with CSS class name and duration, see [Animations](#Animations). | ``{ name: 'fadeout', duration: 400 }`` |
| display | Display the notification when creating it. | true |

> If a notification is ``sticky`` and ``closeOnClick`` is disabled, ``closeButton`` is set to true to always have a way to close a notification.

## Events

There are four events during the process of displaying every notification:

* ``onCreate(notification)`` called when the notification *node* is created but **empty**.
* ``onDisplay(notification)`` called when the notification *node* is appended to its wrapper.
* ``onDeath(notification)`` called when the duration timer has expired.
    * If you set the ``onDeath`` function you take ownership of the notification removal and you need to call ``notification.close()`` or ``notification.destroy()`` manually, or else the notification won't disappear.
* ``onDisplay(notification)`` after the notification has been closed.

## Animations

<p align="center">
    <img width="320" height="92" src="screenshots/success.png">
</p>

You can customize the **insert** and **remove** animations of a notification by giving a value to the ``insertAnimation`` (or ``removeAnimation``) option.
The option take an object like the following:

```javascript
{
    name: "default-insert", // See the list below
    duration: 250 // In ms
}
```

The **insert** animations are: ``insert-[left|top|right|bottom]``, ``fadein``, ``scalein`` and ``rotatein``.

> By default the animation is ``default-insert`` which is a special value that automatically choose the corresponding insert animation after the notification position.

The **remove** animations are: ``fadeout``, ``scaleout`` and ``rotateout``.

You can add your own animations by adding them in your own CSS files and setting the name of the animation in the parameter.

## Markdown-*like* tags

You can insert links, images and stylize text by using tags that resemble **Markdown**.
Most of these tags can be nested to combine their effects.

| Name | Description |
|---|---|
| Inline code | \`\`code\`\` |
| Header (h1) | ``# Header 1\n`` |
| Header (h2) | ``## Header 2\n`` |
| Link | ``{{title\|http://www.example.org/}}`` or ``{{http://www.example.org/}}`` without title. |
| Image | ``![title\|http://www.example.org/image.jpg]`` or ``![http://www.example.org/image.jpg]`` without title. |
| Bold | ``**http://www.example.org/**`` |
| Italic | ``*http://www.example.org/*`` |
| Separator | ``\n---\n`` |
| Float right | ``>*>Text<`` |

Tags work by looking for an open token, an optional separator if there is a title, and the close token.
If the tag can have a *title* you need to use ``|`` as the separator with the *content*.

You can add custom tags easily by adding them to ``zapOptions.tags``.
A tag object can have the following properties:

```javascript
{
    type: 'span', // The node type, e.g <span>
    class: ['class1', 'class2'], // Optional class list as an array or string to use
    attributes: {
        name: value
    }, // Optional attributes to set
    textContent: "$content", // textContent of the created node, see below for variables
                             // If textContent is defined and not false the content cannot have childs (nested other tags)
    title: false, // See "Title" below
    open: '{{', // The opening token - any length
    close: '}}' // The closing token - can be linebreak by using \n - can also be empty
}
```

### Variables

There are two usable *variables* inside attribute values textContent and title:

* ``$content``: the content found between the ``open`` and ``close`` token, without the title if there is one.
* ``$title``: the title found, if there is none it is replaced by the same value as ``$content``.

## Migration

If you were using **SimpleNotification**, a few changes have been made:

* ``closeAnimated`` is replacing ``close`` and is now the default and the old ``close`` has been renamed ``destroy``
* The setters have been removed, you can now directly use assignments in callbacks (e.g ``notification.title = 'Title'`` intead of ``notification.setTitle('Title')``)

## Credits

This package is a port of [SimpleNotification](https://github.com/Glagan/SimpleNotification) for **Svelte**.
If you want to use the same notifications but outside of Svelte or any other frameworks, use Simple Notification.
