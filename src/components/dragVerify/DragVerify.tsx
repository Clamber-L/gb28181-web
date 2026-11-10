import React, { useEffect, useRef, useState } from 'react';

const DragVerify: React.FC<{
    value: boolean;
    onChange: (passed: boolean) => void;
    text: string;
    successText: string;
}> = ({ value, onChange, text, successText }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(0);
    const dragRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !dragRef.current) return;

        const rect = dragRef.current.getBoundingClientRect();
        const newPosition = Math.max(0, Math.min(e.clientX - rect.left - 20, rect.width - 40));
        setDragPosition(newPosition);

        // 如果拖拽到80%以上就算成功
        if (newPosition > (rect.width - 40) * 0.8) {
            onChange(true);
            setIsDragging(false);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (!value) {
            setDragPosition(0);
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, value]);

    return (
        <div className="relative w-full h-10 rounded-md overflow-hidden select-none" ref={dragRef}>
            <div
                className={`relative w-full h-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center transition-all ${
                    value
                        ? 'bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-600'
                        : ''
                }`}
            >
                <div
                    className="text-sm text-gray-500 dark:text-gray-400 transition-opacity"
                    style={{ opacity: value ? 0 : 1 }}
                >
                    {text}
                </div>
                <div
                    className="absolute text-sm text-green-500 dark:text-green-400 transition-opacity"
                    style={{ opacity: value ? 1 : 0 }}
                >
                    {successText}
                </div>
                <div
                    className="absolute left-0 top-0 w-10 h-10 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md flex items-center justify-center cursor-grab shadow-sm hover:border-gray-600 dark:hover:border-gray-400 hover:shadow-md transition-all active:cursor-grabbing"
                    style={{
                        transform: `translateX(${value ? (dragRef.current?.clientWidth || 0) - 40 : dragPosition}px)`,
                    }}
                    onMouseDown={handleMouseDown}
                >
                    {value ? '✓' : '→'}
                </div>
            </div>
        </div>
    );
};

export default DragVerify;
