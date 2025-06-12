import logo from '@/assets/images/Justdive.png'

export function VersionSwitcher() {
    return (
        <div className="py-4 px-4">
            <div className="flex items-center justify-center mx-auto" style={{ maxWidth: '300px' }}>
                <img src={logo} alt="Image" className="w-20 mr-4" />
                <div className="text-left">
                    <p className="text-[#B19759] text-2xl font-semibold">JUST DIVE</p>
                    <p className="text-white text-xs font-medium">By Eesha Adventure</p>
                </div>
            </div>
        </div>
    )
}
