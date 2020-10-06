declare abstract class Callable extends Function{
    protected abstract __call<R>(...args: any[]): R;
}

export default Callable
