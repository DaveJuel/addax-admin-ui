import { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

const AnalogClock = () => {
    const canvasRef = useRef(null);
    const theme = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const radius = Math.min(canvas.width, canvas.height) / 2;
        ctx.translate(radius, radius);
        setInterval(() => drawClock(ctx, radius), 1000);
    }, []);

    const drawClock = (ctx, radius) => {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    };

    const drawFace = (ctx, radius) => {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = theme.palette.background.paper;
        ctx.fill();
        ctx.strokeStyle = theme.palette.text.secondary;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = theme.palette.primary.main;
        ctx.fill();
    };

    const drawNumbers = (ctx, radius) => {
        const fontSize = radius * 0.15;
        ctx.font = `${fontSize}px Arial`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        for (let num = 1; num <= 12; num++) {
            const angle = (num * Math.PI) / 6;
            const x = radius * 0.85 * Math.cos(angle);
            const y = radius * 0.85 * Math.sin(angle);
            ctx.fillText(num.toString(), x, y);
        }
    };

    const drawTime = (ctx, radius) => {
        const now = new Date();
        const hour = now.getHours() % 12;
        const minute = now.getMinutes();
        const second = now.getSeconds();
        drawHand(ctx, ((hour + minute / 60) * Math.PI) / 6, radius * 0.5, radius * 0.07);
        drawHand(ctx, ((minute + second / 60) * Math.PI) / 30, radius * 0.8, radius * 0.07);
        drawHand(ctx, (second * Math.PI) / 30, radius * 0.9, radius * 0.02);
    };

    const drawHand = (ctx, pos, length, width) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    };

    return (
        <canvas
            ref={canvasRef}
            width="360"
            height="360"
            style={{ display: 'block', margin: '20' }}
        ></canvas>
    );
};

export default AnalogClock;
