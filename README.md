# zap

*zap* is a library to display simple yet customizable notifications in Svelte.  
You can stylize text with a simple syntax, add buttons to make the notifications interactable and add callbacks for some events during the life of a notification.

You can find a live demo here: [https://zap.nikurasu.org/](https://zap.nikurasu.org/)  
You can also run the demo locally by installing the dependencies and then run ``pnpm run dev``.

<p align="center">
    <img width="320" height="92" src="screenshots/info.png">
</p>

## Installation

[![npm version](https://badge.fury.io/js/@glagan%2Fzap.svg)](https://badge.fury.io/js/@glagan%2Fzap)

```bash
pnpm add @glagan/zap
```

## How to use

*zap* needs a container to display the notification, you need to have the component ``ZapContainer`` included somewhere, e.g in your index.

```svelte
<script>
	import { ZapContainer } from '@glagan/zap';
</script>

<ZapContainer />
```

Once the container is available, you can display notifications by interacting with the ``zap`` store.

```svelte
<script>
	import { zap } from '@glagan/zap';

	zap.success({ title: 'zap' });
</script>
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
    }],
    classes: ['class'] // Optional additional CSS classes applied to the notification
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

## minimark

**zap** uses [minimark](https://github.com/Glagan/minimark) to render the text inside the notifications.  
You can check the **minimark** documentation to see how to add or write tags.

## Migration

If you were using **SimpleNotification**, a few changes have been made:

* ``closeAnimated`` is replacing ``close`` and is now the default and the old ``close`` has been renamed ``destroy``
* The setters have been removed, you can now directly use assignments in callbacks (e.g ``notification.title = 'Title'`` intead of ``notification.setTitle('Title')``)
* The text renderer is now an external dependency and the tags definition (not the syntax) has changed, see [minimark](https://github.com/Glagan/minimark) documentation for the new definition

## Credits

This package is a port of [SimpleNotification](https://github.com/Glagan/SimpleNotification) for **Svelte**.
If you want to use the same notifications but outside of Svelte or any other frameworks, use Simple Notification.
