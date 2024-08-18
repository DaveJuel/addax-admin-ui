import { useRef, useEffect, } from 'react';
import { useTheme } from '@mui/material/styles';
import { addHours } from 'date-fns';

const AnalogClock = ({ timezoneOffset }) => {
    timezoneOffset = 0;
    // const [timezoneOffset, setTimezoneOffset] = useState(timezoneOffset);
    const canvasRef = useRef(null);
    const theme = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const radius = Math.min(canvas.width, canvas.height) / 2;
        ctx.translate(radius, radius);
        setInterval(() => drawClock(ctx, radius), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timezoneOffset]);

    const drawClock = (ctx, radius) => {
        drawFace(ctx, radius);
        drawTime(ctx, radius);
    };

    const drawFace = (ctx, radius) => {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = theme.palette.background.paper;
        ctx.fill();
    };

    const drawTime = (ctx, radius) => {
        const now = new Date(Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate(),
            new Date().getUTCHours(),
            new Date().getUTCMinutes(),
            new Date().getUTCSeconds()
        ));
        const adjustedTime = addHours(now, timezoneOffset);
        const hour = adjustedTime.getHours() % 12;
        const minute = adjustedTime.getMinutes();
        const second = adjustedTime.getSeconds();
        drawHand(ctx, ((hour + minute / 60) * Math.PI) / 6, radius * 0.5, radius * 0.07, theme.palette.secondary.dark);
        drawHand(ctx, ((minute + second / 60) * Math.PI) / 30, radius * 0.8, radius * 0.05, theme.palette.primary.main);
        drawHand(ctx, (second * Math.PI) / 30, radius * 0.9, radius * 0.02, theme.palette.success.main);
    };

    const drawHand = (ctx, pos, length, width, color) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    };

    return (
        <canvas
            ref={canvasRef}
            width="375"
            height="375"
            style={{ display: 'block', margin: 'auto' }}
        ></canvas>
    );
};

export default AnalogClock;
