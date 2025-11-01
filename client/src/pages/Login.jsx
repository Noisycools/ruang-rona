export default function Login() {
    return (
        <div className="p-6 bg-calm-bg min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-calm-text mb-6 text-center">Masuk ke Ruang Rona</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-calm-text mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-calm-border rounded-md focus:outline-none focus:ring-2 focus:ring-calm-accent"
                            placeholder="Masukkan email Anda"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-calm-text mb-2" htmlFor="password">Kata Sandi</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-calm-border rounded-md focus:outline-none focus:ring-2 focus:ring-calm-accent"
                            placeholder="Masukkan kata sandi Anda"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-calm-accent text-white py-2 rounded-md hover:bg-calm-accent-dark transition-colors"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
}