import logo from '@/assets/images/JustDiveBlack.png';

export function VersionSwitcher() {
    return (
        <div className="py-2 px-4">
            <div className="flex items-center justify-center mx-auto" style={{ maxWidth: '300px' }}>
                <img src={logo} alt="Image" className="w-50" />
            </div>
        </div>
    );
}
