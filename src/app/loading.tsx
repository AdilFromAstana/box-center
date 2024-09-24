import logo from '../assets/logo.png';

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
            <div className="flex flex-col items-center gap-10">
                <img src={logo.src} alt="logo" className="w-[25vw]" />
                <div>
                    <div className="w-20 h-20 rounded-full animate-spin border-8 border-solid border-[#0490C3] border-t-transparent shadow-md"></div>
                </div>
            </div>
        </div>
    );
}
