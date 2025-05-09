"use strict";

const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class DegreeVerification extends Contract {
    async InitLedger(ctx) {
        const degrees = [];

        for (const degree of degrees) {
            degree.docType = "degree";
            await ctx.stub.putState(
                degree.ID,
                Buffer.from(stringify(sortKeysRecursive(degree)))
            );
        }
    }

    async CreateDegree(
        ctx,
        id,
        userId,
        major,
        degreeName,
        degreeType,
        graduationYear,
        gpa,
        approver
    ) {
        const exists = await this.DegreeExists(ctx, id);
        if (exists) {
            throw new Error(`Degree ${id} already exists`);
        }

        const now = new Date().toISOString();

        const degree = {
            ID: id,
            UserID: userId,
            Major: major,
            DegreeName: degreeName,
            DegreeType: Number(degreeType),
            GraduationYear: Number(graduationYear),
            GPA: Number(gpa),
            Status: "pending_level_2",
            IssuedAt: new Date().toISOString(),
            ApprovedByLevel1: approver.id,
            ApprovedAtLevel1: now,
            ApprovedByLevel2: null,
            ApprovedAtLevel2: null,
        };

        await ctx.stub.putState(
            id,
            Buffer.from(stringify(sortKeysRecursive(degree)))
        );
        return JSON.stringify(degree);
    }

    async ApproveLevel2(ctx, id, approver) {
        const degreeString = await this.ReadDegree(ctx, id);
        const degree = JSON.parse(degreeString);

        if (
            degree.Status !== "pending_level_2" ||
            !degree.ApprovedByLevel2 ||
            degree.ApprovedByLevel2 !== null
        ) {
            throw new Error(
                "Degree không ở trạng thái hợp lệ để duyệt mức 2 hoặc đã được duyệt"
            );
        }

        degree.Status = "valid";
        degree.ApprovedByLevel2 = approver.id;
        degree.ApprovedAtLevel2 = new Date().toISOString();

        await ctx.stub.putState(
            id,
            Buffer.from(stringify(sortKeysRecursive(degree)))
        );
        return JSON.stringify(degree);
    }

    async ReadDegree(ctx, id) {
        const degreeJSON = await ctx.stub.getState(id);
        if (!degreeJSON || degreeJSON.length === 0) {
            throw new Error(`Degree ${id} does not exist`);
        }
        return degreeJSON.toString();
    }

    async UpdateDegreeStatus(ctx, id, status) {
        const degreeString = await this.ReadDegree(ctx, id);
        const degree = JSON.parse(degreeString);
        degree.Status = status;

        await ctx.stub.putState(
            id,
            Buffer.from(stringify(sortKeysRecursive(degree)))
        );
    }

    async DeleteDegree(ctx, id) {
        const exists = await this.DegreeExists(ctx, id);
        if (!exists) {
            throw new Error(`Degree ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async DegreeExists(ctx, id) {
        const degreeJSON = await ctx.stub.getState(id);
        return degreeJSON && degreeJSON.length > 0;
    }

    async GetAllDegrees(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange("", "");
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(
                result.value.value.toString()
            ).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = DegreeVerification;
