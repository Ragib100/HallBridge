'use client';

import { getIcon } from '@/components/common/icons';
import { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
    listItems?: string[];
}


export default function FAQPage() {

    const [faqs, setFAQs] = useState<FAQ[]>([
        {
            question: "How long does it take to resolve a maintenance request?",
            answer: "Resolution time depends on the priority and complexity:",
            listItems: [
                "Urgent issues: Within 24 hours",
                "High priority: 2-3 days",
                "Normal priority: Within a week",
                "Low priority: Based on staff availability"
            ]
        },
        {
            question: "Can I track the status of my request?",
            answer: "Yes! You can track all your requests in the \"My Requests\" tab. You'll receive notifications when your request is assigned to a technician and when work is completed."
        },
        {
            question: "What should I do in case of an emergency?",
            answer: "For emergencies (electrical hazards, major leaks, etc.), contact the maintenance office directly at +880-1234-567890. Also submit a request marked as \"Urgent\" for documentation."
        },
        {
            question: "Can I request specific maintenance time slots?",
            answer: "Yes, you can mention your preferred time in the request form. While we'll try to accommodate your preference, urgent issues may need immediate attention."
        },
        {
            question: "What if I'm not satisfied with the service?",
            answer: "After completion, you can rate the service and provide feedback. If the issue persists, you can submit a follow-up request referencing the original ticket number."
        }
    ]);

    const [emergencyContact, setEmergencyContact] = useState<string>('+880-1234-567890');

    return (
        <div className="p-7">
            <div className="mb-7">
                <span className="text-lg font-semibold">{getIcon('question')} Frequently Asked Questions</span>
            </div>

            <div>
                {faqs.map((faq, index) => (
                    <div key={index} className="mb-6">
                        <h3 className="mb-3">Q: {faq.question}</h3>
                        <div className="text-muted-foreground">
                            A: {faq.answer}
                            {faq.listItems && (
                                <ul className="ml-5 mt-2">
                                    {faq.listItems.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-5">
                <div className="">
                    <div className="text-muted-foreground text-sm">Emergency Contact</div>
                    <div className="font-bold">{emergencyContact}</div>
                </div>
                <div className="text-right">
                    <div className="text-muted-foreground text-sm">Office Hours</div>
                    <div className="text-green-600 font-bold">24/7 Emergency Service</div>
                </div>
            </div>
        </div>
    );
}