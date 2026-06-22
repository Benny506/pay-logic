import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'motion/react';
import { HiOutlineCheckCircle } from 'react-icons/hi';

const SuccessStep = ({ resultMessage, onRestart }) => {
    return (
        <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Card className="glass-card border-white border-opacity-10 p-5">
                <HiOutlineCheckCircle size={80} className="text-emerald mb-3" />
                <h2 className="text-white fw-extrabold">Dispatch Successful!</h2>
                <p className="text-slate lead">{resultMessage}</p>
                <Button variant="emerald" className="px-5 py-3 rounded-pill fw-bold mt-4" onClick={onRestart}>
                    Start New Batch
                </Button>
            </Card>
        </motion.div>
    );
};

export default SuccessStep;
