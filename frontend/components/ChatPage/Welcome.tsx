import { title } from "@/components/primitives";

export default function Upload () {
    return (
        <>
        <section className="flex-1 flex flex-col items-center justify-center mb-40 ">
            <div className="max-w-lg  justify-center gap-4 ">
                <h1 className={title({ color: "violet" })}>Type&nbsp;</h1>
                <h1 className={title()}>a query to start.</h1>
            </div>
        </section>
        </>
      );
}