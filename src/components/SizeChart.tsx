'use client';

interface SizeChartProps {
    sizeChart: {
        type: 'table' | 'image';
        imageUrl?: string;
        sizes?: Array<{ label: string; dimensions: string }>;
    } | null;
}

export default function SizeChart({ sizeChart }: SizeChartProps) {
    if (!sizeChart) return null;

    if (sizeChart.type === 'image' && sizeChart.imageUrl) {
        return (
            <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">📏 Size Chart</h4>
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={sizeChart.imageUrl} alt="Size Chart" className="w-full object-contain" />
                </div>
            </div>
        );
    }

    if (sizeChart.type === 'table' && sizeChart.sizes?.length) {
        return (
            <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">📏 Size Chart</h4>
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Size</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Dimensions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizeChart.sizes.map((size, i) => (
                                <tr key={i} className="border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{size.label}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{size.dimensions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return null;
}
