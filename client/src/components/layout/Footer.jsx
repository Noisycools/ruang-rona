export default function Footer() {
    return (
        <footer className="bg-calm-accent text-calm-bg py-4 mt-auto">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Ruang Rona. All rights reserved.</p>
            </div>
        </footer>
    );
}