namespace DOM.Events {

    var started: boolean;
    var customEvents: {
        hasUpdate: Delegate.Func<boolean>,
        invoke: Delegate.Sub,
        name?: string
    }[] = [];

    /**
     * Add custom user event.
     * 
     * @param trigger This lambda function detects that custom event is triggered or not.
     * @param handler This lambda function contains the processor code of your custom event.
    */
    export function Add(trigger: Delegate.Func<boolean> | StatusChanged, handler: Delegate.Sub, tag: string = null) {
        if (trigger instanceof StatusChanged) {
            trigger = function () {
                return (<StatusChanged>trigger).changed;
            }
        }

        customEvents.push({
            hasUpdate: trigger,
            invoke: handler,
            name: tag
        });

        if (!started) {
            setInterval(backgroundInternal, 10);
            started = true;
        }
    }

    function backgroundInternal() {
        for (let hook of customEvents) {
            if (hook.hasUpdate()) {
                hook.invoke();
            }
        }
    }
}